import slugify from "slugify";
import { nanoid } from "nanoid";

export interface GenerateSlugParams {
  modelName: string;
  variantName: string;
  color?: string;
  customId?: string;
}

export function generateProductSlug({
  modelName,
  variantName,
  color,
  customId,
}: GenerateSlugParams): string {
  const baseSlug = slugify(modelName, { lower: true });
  const variantSlug = slugify(variantName, { lower: true });
  
  const colorSlug = color ? slugify(color, { lower: true }) : null;
  
  const parts = [baseSlug, variantSlug];
  if (colorSlug) parts.push(colorSlug);
  
  const suffix = customId || nanoid(6);
  
  return `${parts.join("-")}-${suffix}`;
}

export function generateShortSlug(modelName: string, variantName: string): string {
  const baseSlug = slugify(modelName, { lower: true });
  const variantSlug = slugify(variantName, { lower: true });
  return `${baseSlug}-${variantSlug}`;
}