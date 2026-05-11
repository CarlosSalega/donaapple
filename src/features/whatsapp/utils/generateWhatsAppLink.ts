import type { Product } from "@/features/catalog/types/product";
import type { CanjeMessageOptions } from "@/features/canje/components/index";

export function generateWhatsAppLink(product: Product): string {
  const phoneNumber = "5492324687617";
  const message = encodeURIComponent(
    `Hola! Vi el ${product.name} en la web. ¿Sigue disponible?`,
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

export function generateCanjeWhatsAppLink(
  options: CanjeMessageOptions,
  phoneNumber: string = "5492324687617",
): string {
  const { modelo, bateria, tiempoDeUso, detalles } = options;

  const message = `
🔄 *Consulta Plan Canje*

📱 *Modelo:* ${modelo}
🔋 *Batería:* ${bateria}%
⏱️ *Tiempo de uso:* ${tiempoDeUso}
📝 *Detalles:* ${detalles || "Sin detalles adicionales"}

Me gustaría saber cuánto me dan de crédito para comprar un iPhone nuevo.
  `.trim();

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
