import type { Product } from "./product";

// ============================================
// Mock Products Data
// Using local images from /public/images
// ============================================

export const MOCK_PRODUCTS: Product[] = [
  // iPhone 17 Series
  {
    id: "iphone-17-pro-256",
    name: "iPhone 17 Pro",
    brand: "Apple",
    model: "iPhone 17 Pro",
    storage: "256GB",
    price: 1199,
    originalPrice: 1299,
    condition: "new",
    battery: "100%",
    warranty: "1 año",
    description:
      "El iPhone 17 Pro con chip A19 Pro, cámara triple de 48MP y titanio de grado aeroespacial.",
    images: [
      {
        src: "/images/iphone-17-pro.png",
        alt: "iPhone 17 Pro",
        priority: true,
      },
    ],
    isFeatured: true,
    isNew: true,
    stock: 5,
    colors: ["Natural", "Blue", "White", "Black"],
  },
  {
    id: "iphone-17-256",
    name: "iPhone 17",
    brand: "Apple",
    model: "iPhone 17",
    storage: "256GB",
    price: 899,
    condition: "new",
    battery: "100%",
    warranty: "1 año",
    description:
      'iPhone 17 con A19 chip, pantalla Super Retina XDR de 6.3" y sistema de cámara actualizado.',
    images: [
      {
        src: "/images/iphone-17.png",
        alt: "iPhone 17",
        priority: true,
      },
    ],
    isFeatured: false,
    isNew: true,
    stock: 8,
    colors: ["Blue", "Green", "Pink", "Black"],
  },
  {
    id: "iphone-17-air-128",
    name: "iPhone 17 Air",
    brand: "Apple",
    model: "iPhone 17 Air",
    storage: "128GB",
    price: 799,
    condition: "new",
    battery: "100%",
    warranty: "1 año",
    description:
      "El iPhone más delgado jamás creado. iPhone 17 Air redefine el diseño ligero.",
    images: [
      {
        src: "/images/iphone-17-air.png",
        alt: "iPhone 17 Air",
        priority: true,
      },
    ],
    isFeatured: true,
    isNew: true,
    stock: 3,
    colors: ["Titanium", "Silver"],
  },
  {
    id: "iphone-17-e-128",
    name: "iPhone 17e",
    brand: "Apple",
    model: "iPhone 17",
    storage: "128GB",
    price: 699,
    condition: "refurbished",
    battery: "95%+",
    warranty: "6 meses",
    description:
      "iPhone 17e reacondicionado, calidad verificada. Ideal para quien busca el mejor precio.",
    images: [
      {
        src: "/images/iphone-17-e.png",
        alt: "iPhone 17e",
        priority: true,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 6,
    colors: ["Black", "White"],
  },

  // iPhone 16 Series
  {
    id: "iphone-16-pro-256",
    name: "iPhone 16 Pro",
    brand: "Apple",
    model: "iPhone 16 Pro",
    storage: "256GB",
    price: 999,
    originalPrice: 1099,
    condition: "new",
    battery: "100%",
    warranty: "1 año",
    description:
      'iPhone 16 Pro con A18 Pro chip, Control de Cámara y pantalla de 6.3" con ProMotion.',
    images: [
      {
        src: "/images/iphone-16-pro.jpg",
        alt: "iPhone 16 Pro",
        priority: true,
      },
    ],
    isFeatured: true,
    isNew: false,
    stock: 4,
    colors: ["Natural", "Blue", "White", "Black"],
  },
  {
    id: "iphone-16-128",
    name: "iPhone 16",
    brand: "Apple",
    model: "iPhone 16",
    storage: "128GB",
    price: 799,
    condition: "new",
    battery: "100%",
    warranty: "1 año",
    description:
      "iPhone 16 con A18 chip, Camera Control y Action Button. Potencia y estilo.",
    images: [
      {
        src: "/images/iphone-16.jpg",
        alt: "iPhone 16",
        priority: true,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 7,
    colors: ["Black", "White", "Pink", "Teal", "Ultramarine"],
  },

  // iPhone 14 Series
  {
    id: "iphone-14-pro-128",
    name: "iPhone 14 Pro",
    brand: "Apple",
    model: "iPhone 14 Pro",
    storage: "128GB",
    price: 699,
    originalPrice: 999,
    condition: "refurbished",
    battery: "90%+",
    warranty: "6 meses",
    description:
      "iPhone 14 Pro reacondicionado. Dynamic Island, cámara de 48MP y chip A16 Bionic.",
    images: [
      {
        src: "/images/iphone-14-pro.jpg",
        alt: "iPhone 14 Pro",
        priority: false,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 5,
    colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
  },

  // iPhone 13 Series
  {
    id: "iphone-13-pro-128",
    name: "iPhone 13 Pro",
    brand: "Apple",
    model: "iPhone 13 Pro",
    storage: "128GB",
    price: 549,
    originalPrice: 999,
    condition: "used-excellent",
    battery: "87%",
    warranty: "3 meses",
    description:
      "iPhone 13 Pro en excelente estado. Pantalla ProMotion 120Hz y sistema de cámara Pro.",
    images: [
      {
        src: "/images/iphone-13-pro.jpg",
        alt: "iPhone 13 Pro",
        priority: false,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 3,
    colors: ["Graphite", "Gold", "Silver", "Sierra Blue"],
  },

  // iPhone 12 Series
  {
    id: "iphone-12-64",
    name: "iPhone 12",
    brand: "Apple",
    model: "iPhone 12",
    storage: "64GB",
    price: 399,
    originalPrice: 799,
    condition: "used-good",
    battery: "82%",
    warranty: "Sin garantía",
    description:
      'iPhone 12 en buen estado. Chip A14 Bionic y pantalla Super Retina XDR de 6.1".',
    images: [
      {
        src: "/images/iphone-12.jpg",
        alt: "iPhone 12",
        priority: false,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 2,
    colors: ["Black", "White", "Blue", "Green", "Purple", "Red"],
  },

  // iPhone 11 Series
  {
    id: "iphone-11-64",
    name: "iPhone 11",
    brand: "Apple",
    model: "iPhone 11",
    storage: "64GB",
    price: 299,
    originalPrice: 699,
    condition: "used-good",
    battery: "78%",
    warranty: "Sin garantía",
    description:
      "iPhone 11 reacondicionado. Cámaras ultra gran angular y gran angular de 12MP.",
    images: [
      {
        src: "/images/iphone-11.jpg",
        alt: "iPhone 11",
        priority: false,
      },
    ],
    isFeatured: false,
    isNew: false,
    stock: 4,
    colors: ["Black", "White", "Green", "Yellow", "Purple", "Red"],
  },
];

// ============================================
// Helper functions
// ============================================

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isNew);
}

export function filterProducts(filters: {
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  storage?: string;
}): Product[] {
  return MOCK_PRODUCTS.filter((product) => {
    if (filters.model && product.model !== filters.model) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.condition && product.condition !== filters.condition)
      return false;
    if (filters.storage && product.storage !== filters.storage) return false;
    return true;
  });
}
