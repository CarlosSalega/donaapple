export const MODELS = [
  // iPhone 14 series
  { name: "iPhone 14", slug: "iphone-14", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 14 Pro", slug: "iphone-14-pro", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 14 Pro Max", slug: "iphone-14-pro-max", categorySlug: "iphone", brandSlug: "apple" },
  // iPhone 15 series
  { name: "iPhone 15", slug: "iphone-15", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 15 Plus", slug: "iphone-15-plus", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 15 Pro", slug: "iphone-15-pro", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", categorySlug: "iphone", brandSlug: "apple" },
  // iPhone 16 series
  { name: "iPhone 16", slug: "iphone-16", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 16 Plus", slug: "iphone-16-plus", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 16 Pro", slug: "iphone-16-pro", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", categorySlug: "iphone", brandSlug: "apple" },
  // iPhone 17 series
  { name: "iPhone 17", slug: "iphone-17", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 17 Pro", slug: "iphone-17-pro", categorySlug: "iphone", brandSlug: "apple" },
  { name: "iPhone 17 Air", slug: "iphone-17-air", categorySlug: "iphone", brandSlug: "apple" },
] as const;

export type Model = (typeof MODELS)[number];