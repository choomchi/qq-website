"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";

export type InvalidateCategoryInput = {
  slug: string;
};

export const useInvalidateCategoryProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug }: InvalidateCategoryInput) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.categories.bySlug(slug),
      });
    },
  });
};
