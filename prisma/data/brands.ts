export const BRANDS = [
  { name: "Apple", slug: "apple" },
  { name: "Samsung", slug: "samsung" },
] as const;

export type Brand = (typeof BRANDS)[number];