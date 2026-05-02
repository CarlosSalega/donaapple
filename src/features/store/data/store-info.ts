export interface StoreInfo {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  paymentMethods: {
    name: string;
    icon: string;
  }[];
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const STORE_INFO: StoreInfo = {
  name: "Apple Store Demo",
  address: "Av. Corrientes 1234",
  neighborhood: "Microcentro",
  city: "Buenos Aires, Argentina",
  hours: {
    weekdays: "9:00 - 19:00",
    saturday: "10:00 - 15:00",
    sunday: "Cerrado",
  },
  phone: "+54 11 5555-1234",
  whatsapp: "+54 9 11 5555-1234",
  email: "hola@applestore.demo",
  paymentMethods: [
    { name: "Efectivo", icon: "💵" },
    { name: "Transferencia", icon: "🏦" },
    { name: "Tarjeta Débito", icon: "💳" },
    { name: "Mercado Pago", icon: "📱" },
    { name: "Cuotas", icon: "📆" },
  ],
  features: [
    {
      title: "Garantía",
      description: "Todos nuestros productos incluyen garantía",
      icon: "✅",
    },
    {
      title: "Envío Rápido",
      description: "Entregas en 24-48hs en CABA",
      icon: "🚚",
    },
    {
      title: "Atención Personal",
      description: "Te ayudamos a elegir el mejor equipo",
      icon: "💬",
    },
    {
      title: "Precio Justo",
      description: "Los mejores precios del mercado",
      icon: "💰",
    },
  ],
};
