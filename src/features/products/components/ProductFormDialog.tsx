// product-form-dialog.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { ProductForm } from "./ProductForm";

type Option = { id: string; name: string };
type OptionWithRelation = {
  id: string;
  name: string;
  brandId?: string;
  categoryId?: string;
  modelId?: string;
};

interface Props {
  brands: Option[];
  categories: OptionWithRelation[];
  models: OptionWithRelation[];
  variants: OptionWithRelation[];
}

export function ProductFormDialog(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-1 size-4" />
        Nuevo Producto
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-1/2! max-h-[90vh] w-[calc(100%-16px)]! max-w-2xl -translate-x-1/2! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription className="sr-only">
              Completá los datos para crear un nuevo producto en el catálogo.
            </DialogDescription>
          </DialogHeader>
          <ProductForm {...props} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
