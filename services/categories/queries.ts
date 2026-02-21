"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";
import { categoriesApi } from "./categories-api";

export type UseGetCategoryProductsOptions = {
  slug: string;
  first?: number;
  after?: string;
  enabled?: boolean;
  staleTime?: number;
};

export const useGetCategoryProducts = ({
  slug,
  first = 12,
  after = "",
  enabled = true,
  staleTime = 60_000,
}: UseGetCategoryProductsOptions) => {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug, first, after),
    queryFn: () => categoriesApi.getCategoryProducts(slug, first, after),
    enabled,
    staleTime,
  });
};
