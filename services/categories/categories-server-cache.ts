import "server-only";

import { unstable_cache } from "next/cache";

import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache";
import type { ProductCategoryTreeNode } from "@/types/category";
import { categoriesApi } from "./categories-api";

const getCachedProductCategoriesTreeInternal = unstable_cache(
  async (first: number): Promise<ProductCategoryTreeNode[]> => {
    return categoriesApi.getProductCategoriesTree(first);
  },
  ["categories-server-cache:getProductCategoriesTree"],
  {
    revalidate: CACHE_REVALIDATE.categoryTree,
    tags: [CACHE_TAGS.home, CACHE_TAGS.categories, CACHE_TAGS.categoryTree],
  },
);

export async function getCachedProductCategoriesTree(
  first = 100,
): Promise<ProductCategoryTreeNode[]> {
  return getCachedProductCategoriesTreeInternal(first);
}
