"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import { Check, Plus, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type EntityOption = {
  id: string;
  name: string;
};

type EntityType = "brand" | "category" | "model" | "variant";

interface EntityComboboxProps {
  entity: EntityType;
  value: string;
  onChange: (value: string) => void;
  options: EntityOption[];
  onCreate: (
    name: string,
  ) => Promise<{ success: boolean; entity?: EntityOption; error?: string }>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function EntityCombobox({
  entity,
  value,
  onChange,
  options,
  onCreate,
  placeholder = `Seleccionar ${entity}`,
  disabled = false,
  className,
}: EntityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = useMemo(() => {
    if (!value || options.length === 0) return null;
    return options.find((o) => o.id === value) || null;
  }, [value, options]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(lower));
  }, [options, search]);

  const hasSearch = search.trim().length > 0;

  const handleCreate = useCallback(async () => {
    if (!search.trim()) return;

    setError(null);
    setCreating(true);
    try {
      const result = await onCreate(search.trim());
      if (result.success && result.entity) {
        onChange(result.entity.id);
        setSearch("");
        setOpen(false);
        toast.success(`${entity} creado: ${result.entity.name}`);
      } else {
        setError(result.error || `Error al crear ${entity}`);
        toast.error(result.error || `Error al crear ${entity}`);
      }
    } catch (err) {
      const errorMsg = `Error al crear ${entity}`;
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setCreating(false);
    }
  }, [search, onCreate, onChange, entity]);

  const handleSelect = useCallback(
    (option: EntityOption) => {
      onChange(option.id);
      setSearch("");
      setError(null);
      setOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      setSearch("");
      setError(null);
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange, open],
  );

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
      setError(null);
    }
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }, []);

  const entityLabel = useMemo(() => {
    const labels: Record<EntityType, string> = {
      brand: "marca",
      category: "categoría",
      model: "modelo",
      variant: "variante",
    };
    return labels[entity];
  }, [entity]);

  const entityLabelCapitalized = useMemo(() => {
    return entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);
  }, [entityLabel]);

  const hasValue = value && selectedOption !== null;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          className={cn(
            "border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            "placeholder:text-muted-foreground focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className,
          )}
        >
          {hasValue ? (
            <span className="truncate">{selectedOption?.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {hasValue ? (
            <X
              className="text-muted-foreground hover:text-foreground h-4 w-4 shrink-0 cursor-pointer"
              onClick={handleClear}
            />
          ) : null}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-md border shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          sideOffset={4}
          onWheel={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (
              target.closest('[data-slot="popover-trigger"]') ===
              buttonRef.current
            ) {
              e.preventDefault();
            }
          }}
        >
          <Command className="relative" shouldFilter={true}>
            <div className="flex items-center border-b px-3">
              <CommandInput
                ref={inputRef}
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  setError(null);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={`Buscar ${entityLabel}...`}
                className="placeholder:text-muted-foreground flex h-11 w-full rounded-sm bg-transparent py-3 text-sm outline-none"
              />
            </div>

            <CommandList
              className={cn("max-h-75 overflow-x-hidden overflow-y-auto p-1")}
            >
              {hasSearch && (
                <div className="px-2 py-2">
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating || !hasSearch}
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Crear &quot;{search}&quot;</span>
                  </button>
                  {error && (
                    <p className="text-destructive mt-1 px-1 text-xs">
                      {error}
                    </p>
                  )}
                </div>
              )}

              {filteredOptions.length > 0 && (
                <CommandGroup
                  heading={entityLabelCapitalized}
                  className="text-muted-foreground px-2 py-1.5 text-xs"
                >
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(option)}
                      className={cn(
                        "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
                        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                      )}
                    >
                      <Check
                        className={cn(
                          "absolute left-2 h-4 w-4",
                          selectedOption?.id === option.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate">{option.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {!hasSearch && filteredOptions.length === 0 && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  No hay {entityLabel}s disponibles
                </div>
              )}

              {hasSearch && filteredOptions.length === 0 && !creating && (
                <div className="text-muted-foreground py-2 text-center text-xs">
                  Presiona Enter para crear
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export type { EntityOption as EntityComboboxOption };
