"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Copy,
  Trash2,
} from "lucide-react";

interface ProductActionsProps {
  productId: string;
  isActive: boolean;
  isFeatured: boolean;
}

export function ProductActions({
  productId,
  isActive,
  isFeatured,
}: ProductActionsProps) {
  const router = useRouter();

  const handleToggleActive = async () => {
    const res = await fetch(`/api/products/${productId}/toggle-active`, {
      method: "POST",
    });
    if (res.ok) router.refresh();
  };

  const handleToggleFeatured = async () => {
    const res = await fetch(`/api/products/${productId}/toggle-featured`, {
      method: "POST",
    });
    if (res.ok) router.refresh();
  };

  const handleDuplicate = async () => {
    const res = await fetch(`/api/products/${productId}/duplicate`, {
      method: "POST",
    });
    if (res.ok) router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/productos/${productId}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/producto/${productId}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleActive}>
          {isActive ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Desactivar
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Activar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFeatured}>
          {isFeatured ? (
            <>
              <StarOff className="mr-2 h-4 w-4" />
              Quitar destacado
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Destacar
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
