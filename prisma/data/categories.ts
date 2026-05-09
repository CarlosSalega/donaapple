export const CATEGORIES = [
  // Apple
  { name: "iPhone", slug: "iphone", brandSlug: "apple" },
  { name: "Mac", slug: "mac", brandSlug: "apple" },
  { name: "iPad", slug: "ipad", brandSlug: "apple" },
  { name: "Watch", slug: "watch", brandSlug: "apple" },
  // Samsung
  { name: "Smartphones", slug: "samsung-smartphones", brandSlug: "samsung" },
] as const;

export type Category = (typeof CATEGORIES)[number];