import slugify from "slugify";
import { nanoid } from "nanoid";

const SLUG_OPTIONS = { lower: true, strict: true, trim: true };

export interface GenerateSlugParams {
  brand: string;
  category: string;
  modelName: string;
  variantName?: string;
  color?: string;
  withSuffix?: boolean;
}

export function generateProductSlug({
  brand,
  category,
  modelName,
  variantName,
  color,
  withSuffix = false,
}: GenerateSlugParams): string {
  const parts = [brand, category, modelName, variantName ?? undefined, color]
    .filter(Boolean)
    .map((s) => slugify(s!, SLUG_OPTIONS));

  const base = parts.join("-");

  return withSuffix ? `${base}-${nanoid(6)}` : base;
}
