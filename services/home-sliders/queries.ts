"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/services/query-keys";
import { homeSlidersApi } from "./home-sliders-api";

export type UseGetHomeSlidersOptions = {
  enabled?: boolean;
  metaKey?: string;
  staleTime?: number;
};

export const useGetHomeSliders = ({
  enabled = true,
  metaKey = "images",
  staleTime = 60_000,
}: UseGetHomeSlidersOptions = {}) => {
  return useQuery({
    queryKey: queryKeys.homeSliders.byMetaKey(metaKey),
    queryFn: () => homeSlidersApi.getHomeSliders(metaKey),
    enabled,
    staleTime,
  });
};
