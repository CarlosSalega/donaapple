import type { Product } from "@/features/catalog/types/product";

/**
 * Generate WhatsApp click-to-chat URL with contextual message
 */
export function generateWhatsAppLink(product: Product): string {
  const phoneNumber = "5491100000000"; // Placeholder - replace with actual number
  const message = encodeURIComponent(
    `Hola! Vi el ${product.name} ${product.storage} en la web. ¿Sigue disponible?`,
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
}
