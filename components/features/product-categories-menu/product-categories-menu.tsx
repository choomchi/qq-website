import Link from "next/link";

import { getCachedProductCategoriesTree } from "@/services/categories/categories-server-cache";
import type { ProductCategoryTreeNode } from "@/types/category";
import ProductCategoriesMenuPanel from "./product-categories-menu-panel";

const HIDDEN_CATEGORY_NAMES = new Set(["دسته‌بندی نشده", "دسته بندی نشده"]);
const HIDDEN_CATEGORY_SLUGS = new Set(["دسته-بندی-نشده", "uncategorized"]);

const SITE_CONTAINER_NAMES = new Set(["سايت", "سایت"]);
const SITE_CONTAINER_SLUGS = new Set(["سايت", "سایت", "site"]);

function normalizeCategories(
  categories: ProductCategoryTreeNode[],
  depth = 0,
): ProductCategoryTreeNode[] {
  const normalized: ProductCategoryTreeNode[] = [];

  for (const category of categories) {
    const normalizedChildren = normalizeCategories(category.children, depth + 1);

    const isHiddenCategory =
      HIDDEN_CATEGORY_NAMES.has(category.name) || HIDDEN_CATEGORY_SLUGS.has(category.slug);

    if (isHiddenCategory) {
      continue;
    }

    const mappedCategory: ProductCategoryTreeNode = {
      ...category,
      children: normalizedChildren,
    };

    const isTopLevelSiteContainer =
      depth === 0 &&
      (SITE_CONTAINER_NAMES.has(mappedCategory.name) ||
        SITE_CONTAINER_SLUGS.has(mappedCategory.slug));

    if (isTopLevelSiteContainer) {
      normalized.push(...mappedCategory.children);
      continue;
    }

    normalized.push(mappedCategory);
  }

  return normalized;
}

function FallbackCategoriesLink() {
  return (
    <Link
      href="/product-category"
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-medium text-dark-gray transition-colors hover:bg-white/65 hover:text-primary-red md:text-sm"
    >
      دسته بندی ها
    </Link>
  );
}

async function getNormalizedCategories(): Promise<ProductCategoryTreeNode[]> {
  try {
    const categories = await getCachedProductCategoriesTree();
    return normalizeCategories(categories);
  } catch {
    return [];
  }
}

export default async function ProductCategoriesMenu() {
  const normalizedCategories = await getNormalizedCategories();

  if (!normalizedCategories.length) {
    return <FallbackCategoriesLink />;
  }

  return <ProductCategoriesMenuPanel categories={normalizedCategories} />;
}
