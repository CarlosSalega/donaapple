export interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  date?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "María González",
    avatar: "MG",
    rating: 5,
    text: "Compré un iPhone 15 Pro reacondicionado y llegó impecable. La batería al 95% y sin un solo rayón.",
    product: "iPhone 15 Pro 256GB",
    date: "Hace 2 semanas",
  },
  {
    name: "Javier Pérez",
    avatar: "JP",
    rating: 5,
    text: "La atención por WhatsApp es increíble. Me ayudaron a elegir el modelo perfecto para mi presupuesto.",
    product: "iPhone 14 Pro",
    date: "Hace 1 mes",
  },
  {
    name: "Sofía Rodríguez",
    avatar: "SR",
    rating: 5,
    text: "Tercera compra aquí y siempre todo perfecto. El último fue un iPhone 13 para mi vieja, ¡le encantó!",
    product: "iPhone 13",
    date: "Hace 3 semanas",
  },
  {
    name: "Lucas Martín",
    avatar: "LM",
    rating: 5,
    text: "Superó mis expectativas. Precio justo y garantía de 6 meses.",
    product: "iPhone 14",
    date: "Hace 1 semana",
  },
];