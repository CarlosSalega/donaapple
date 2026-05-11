"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

export interface StoreFeature {
  title: string;
  description: string;
}

interface StoreFeaturesEditorProps {
  value: StoreFeature[];
  onChange: (features: StoreFeature[]) => void;
  maxItems?: number;
}

export function StoreFeaturesEditor({
  value,
  onChange,
  maxItems = 6,
}: StoreFeaturesEditorProps) {
  const features = value.length > 0 ? value : [{ title: "", description: "" }];

  const handleChange = (index: number, field: "title" | "description", text: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: text };
    onChange(newFeatures.filter((f) => f.title.trim() !== ""));
  };

  const handleAdd = () => {
    if (features.length < maxItems) {
      onChange([...features, { title: "", description: "" }]);
    }
  };

  const handleRemove = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange(newFeatures.length > 0 ? newFeatures : [{ title: "", description: "" }]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="border-border rounded-xl border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Feature {index + 1}
              </span>
              {features.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Título (ej: Garantía)"
                value={feature.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              <Textarea
                placeholder="Descripción breve"
                value={feature.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
        ))}
      </div>
      {features.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Agregar feature
        </Button>
      )}
      <p className="text-muted-foreground text-xs">
        Máximo {maxItems} features · El icono se asigna automáticamente por título
      </p>
    </div>
  );
}
