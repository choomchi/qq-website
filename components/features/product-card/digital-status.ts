import type { Product, ProductAttribute } from "@/types/product";

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("fa-IR")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAttributeValue(attribute: ProductAttribute): boolean {
  const hasOption = attribute.options.some((option) => normalizeText(option).length > 0);
  const hasTerm =
    attribute.terms?.nodes.some((term) => normalizeText(term.name).length > 0) ?? false;

  return hasOption || hasTerm;
}

function isDigitalStatusAttribute(attribute: ProductAttribute): boolean {
  const normalizedName = normalizeText(attribute.name);
  const normalizedLabel = normalizeText(attribute.label);

  return normalizedName.includes("digital") || normalizedLabel.includes("دیجیتال");
}

export function hasDigitalStatusAttribute(product: Product): boolean {
  const digitalAttribute = product.attributes?.nodes.find(isDigitalStatusAttribute);

  if (!digitalAttribute) return false;

  return hasAttributeValue(digitalAttribute);
}
