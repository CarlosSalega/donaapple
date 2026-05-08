"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/shared/components/ui/combobox";
import { Plus, Loader2 } from "lucide-react";
import { createVariant } from "@/server/actions/catalogo/variant";

type VariantOption = {
  id: string;
  name: string;
};

interface VariantComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: VariantOption[];
  maxItems?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function VariantCombobox({
  value,
  onChange,
  options,
  maxItems = 3,
  disabled = false,
  placeholder = "Seleccionar variantes...",
}: VariantComboboxProps) {
  const anchorRef = useComboboxAnchor();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((v) => v.name.toLowerCase().includes(lower));
  }, [options, search]);

  const handleCreate = useCallback(async () => {
    if (!search.trim() || value.length >= maxItems) return;

    setCreating(true);
    try {
      const result = await createVariant({ name: search.trim() });
      if (result.success && result.variant) {
        onChange([...value, result.variant.id]);
        setSearch("");
        toast.success(`Variante "${result.variant.name}" creada`);
      } else {
        toast.error(result.error || "Error al crear variante");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear variante");
    } finally {
      setCreating(false);
    }
  }, [search, value, maxItems, onChange]);

  const handleSelect = useCallback(
    (variantId: string) => {
      if (value.includes(variantId)) {
        onChange(value.filter((id) => id !== variantId));
      } else if (value.length < maxItems) {
        onChange([...value, variantId]);
      } else {
        toast.warning(`Máximo ${maxItems} variantes permitidas`);
      }
    },
    [value, maxItems, onChange],
  );

  const canCreate = search.trim().length > 0 && value.length < maxItems;
  const isFull = value.length >= maxItems;

  const getVariantName = (id: string) => {
    const variant = options.find((opt) => opt.id === id);
    return variant?.name || id;
  };

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={(newValue) => onChange(newValue as string[])}
      disabled={disabled}
    >
      <ComboboxChips ref={anchorRef} className="min-h-5">
        {value.map((variantId) => (
          <ComboboxChip key={variantId}>
            {getVariantName(variantId)}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput
          placeholder={value.length === 0 ? placeholder : ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      </ComboboxChips>

      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>
          {isFull
            ? `Máximo ${maxItems} variantes`
            : "No hay variantes disponibles"}
        </ComboboxEmpty>
        <ComboboxList>
          {filteredOptions.map((variant) => (
            <ComboboxItem
              key={variant.id}
              value={variant.id}
              onSelect={() => handleSelect(variant.id)}
            >
              {variant.name}
            </ComboboxItem>
          ))}

          {canCreate && (
            <ComboboxItem value={search.trim()} onSelect={handleCreate}>
              {creating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Crear &quot;{search}&quot;
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
