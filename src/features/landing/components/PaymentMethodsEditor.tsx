"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PaymentMethod {
  name: string;
  icon: string;
}

const AVAILABLE_ICONS = [
  { emoji: "💵", label: "Efectivo" },
  { emoji: "🏦", label: "Banco" },
  { emoji: "💳", label: "Tarjeta" },
  { emoji: "📱", label: "Mercado Pago" },
  { emoji: "📆", label: "Cuotas" },
  { emoji: "💰", label: "Dinero" },
  { emoji: "🔄", label: "Transferencia" },
  { emoji: "🏧", label: "Cajero" },
];

interface PaymentMethodsEditorProps {
  value: PaymentMethod[];
  onChange: (methods: PaymentMethod[]) => void;
}

export function PaymentMethodsEditor({ value = [], onChange }: PaymentMethodsEditorProps) {
  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodIcon, setNewMethodIcon] = useState("💵");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const handleAdd = () => {
    if (!newMethodName.trim()) return;
    onChange([...value, { name: newMethodName.trim(), icon: newMethodIcon }]);
    setNewMethodName("");
    setNewMethodIcon("💵");
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditName(value[index].name);
    setEditIcon(value[index].icon);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...value];
    updated[editingIndex] = { name: editName.trim(), icon: editIcon };
    onChange(updated);
    setEditingIndex(null);
    setEditName("");
    setEditIcon("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditIcon("");
  };

  return (
    <div className="space-y-4">
      {/* Lista actual */}
      {value.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Métodos configurados</label>
          <div className="grid gap-2">
            {value.map((method, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="flex items-center justify-between p-3">
                  {editingIndex === index ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {AVAILABLE_ICONS.map((ic) => (
                            <button
                              key={ic.emoji}
                              type="button"
                              onClick={() => setEditIcon(ic.emoji)}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all",
                                editIcon === ic.emoji
                                  ? "bg-primary/10 ring-2 ring-primary"
                                  : "bg-muted hover:bg-muted/80"
                              )}
                            >
                              {ic.emoji}
                            </button>
                          ))}
                        </div>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 w-40"
                          placeholder="Nombre del método"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={saveEdit}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Agregar nuevo */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Agregar método de pago</label>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            {AVAILABLE_ICONS.map((ic) => (
              <button
                key={ic.emoji}
                type="button"
                onClick={() => setNewMethodIcon(ic.emoji)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all",
                  newMethodIcon === ic.emoji
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted hover:bg-muted/80"
                )}
                title={ic.label}
              >
                {ic.emoji}
              </button>
            ))}
          </div>
          <div className="flex flex-1 gap-2">
            <Input
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              placeholder="Nombre del método"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!newMethodName.trim()}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Presioná Enter o click en + para agregar
        </p>
      </div>

      {/* Preview */}
      {value.length > 0 && (
        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium text-muted-foreground">Vista previa</label>
          <div className="flex flex-wrap gap-2">
            {value.map((method, index) => (
              <span
                key={index}
                className="border-border bg-surface-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
              >
                <span className="text-brand">{method.icon}</span>
                <span className="text-text-primary">{method.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}