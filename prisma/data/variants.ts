export const VARIANTS = [
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
] as const;

export type Variant = (typeof VARIANTS)[number];