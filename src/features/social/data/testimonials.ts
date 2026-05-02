interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    avatar: "MG",
    rating: 5,
    text: "Compré un iPhone 15 Pro reacondicionado y llegó impecable. La batería al 95% y sin un solo rayón. El envío fue rapidísimo.",
    product: "iPhone 15 Pro 256GB",
    date: "Hace 2 semanas",
  },
  {
    id: "2",
    name: "Javier Pérez",
    avatar: "JP",
    rating: 5,
    text: "La atención por WhatsApp es increíble. Me ayudaron a elegir el modelo perfecto para mi presupuesto. 100% recomendado.",
    product: "iPhone 14 Pro",
    date: "Hace 1 mes",
  },
  {
    id: "3",
    name: "Sofia Rodríguez",
    avatar: "SR",
    rating: 5,
    text: "Tercera compra aquí y siempre todo perfecto. El último fue un iPhone 13 para mi vieja, ¡le encantó!",
    product: "iPhone 13",
    date: "Hace 3 semanas",
  },
  {
    id: "4",
    name: "Lucas Martín",
    avatar: "LM",
    rating: 5,
    text: "Tenía mis dudas por ser reacondicionado pero superó mis expectativas. Precio justo y garantía de 6 meses.",
    product: "iPhone 14",
    date: "Hace 1 semana",
  },
  {
    id: "5",
    name: "Camila Torres",
    avatar: "CT",
    rating: 5,
    text: "Me contactedaron al toque cuando hice la consulta. El iPhone llegó el mismo día en Capital Federal. Increíble servicio.",
    product: "iPhone 16",
    date: "Hace 5 días",
  },
  {
    id: "6",
    name: "Federico Lima",
    avatar: "FL",
    rating: 5,
    text: "Comparando precios son los mejores del mercado. Me dieron financiación sin drama. El producto llegó exactly como decían.",
    product: "iPhone 15",
    date: "Hace 2 semanas",
  },
];
