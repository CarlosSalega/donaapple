// product-filters.tsx
"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Condition } from "@prisma/client";

interface CatalogOptions {
  brands: { id: string; name: string }[];
}

interface ProductFiltersProps {
  catalogOptions: CatalogOptions;
  search: string;
  brandId?: string;
  condition?: Condition | "all";
  isActive?: string;
}

function FiltersForm({
  catalogOptions,
  search,
  brandId,
  condition,
  isActive,
  onSubmit,
}: ProductFiltersProps & { onSubmit?: () => void }) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit ? () => onSubmit() : undefined}
    >
      <div className="flex-1">
        <Input
          name="search"
          placeholder="Buscar productos..."
          defaultValue={search}
          className="w-full"
        />
      </div>
      <Select name="brandId" defaultValue={brandId || "all"}>
        <SelectTrigger>
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las marcas</SelectItem>
          {catalogOptions.brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select name="condition" defaultValue={condition || "all"}>
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="NEW">Nuevo</SelectItem>
          <SelectItem value="USED">Usado</SelectItem>
          <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
        </SelectContent>
      </Select>
      <Select name="isActive" defaultValue={isActive || "all"}>
        <SelectTrigger>
          <SelectValue placeholder="Activos / Inactivos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="submit"
        variant="secondary"
        className="border-brand text-brand w-full border"
      >
        Filtrar
      </Button>
    </form>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: card normal, igual que antes */}
      <Card className="hidden md:block">
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-4">
            <div className="min-w-50 flex-1">
              <Input
                name="search"
                placeholder="Buscar productos..."
                defaultValue={props.search}
                className="w-full"
              />
            </div>
            <div className="min-w-37.5">
              <Select name="brandId" defaultValue={props.brandId || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {props.catalogOptions.brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-37.5">
              <Select name="condition" defaultValue={props.condition || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="USED">Usado</SelectItem>
                  <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-37.5">
              <Select name="isActive" defaultValue={props.isActive || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="border-brand text-brand border"
            >
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mobile: FAB + Sheet */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed right-6 bottom-6 z-50 size-10 rounded-full shadow-lg md:hidden"
          >
            <SlidersHorizontal className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="left-1/2! w-[calc(100%-16px)]! max-w-md -translate-x-1/2! rounded-2xl px-6 pb-8">
          <DialogHeader className="mb-4">
            <DialogTitle>Filtros</DialogTitle>
            <DialogDescription className="sr-only">
              Filtrá los productos por marca, estado y disponibilidad.
            </DialogDescription>
          </DialogHeader>
          <FiltersForm {...props} onSubmit={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
