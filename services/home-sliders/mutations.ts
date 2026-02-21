"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";

export type RefreshHomeSlidersInput = {
  metaKey?: string;
};

export const useRefreshHomeSliders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ metaKey = "images" }: RefreshHomeSlidersInput = {}) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.homeSliders.byMetaKey(metaKey),
      });
    },
  });
};
