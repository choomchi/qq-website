"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/query-keys";
import { seriesApi } from "./series-api";

export type UseGetSeriesOptions = {
  count?: number;
  enabled?: boolean;
  staleTime?: number;
};

export const useGetSeriesList = ({
  count = 20,
  enabled = true,
  staleTime = 60_000,
}: UseGetSeriesOptions = {}) => {
  return useQuery({
    queryKey: queryKeys.series.all(),
    queryFn: () => seriesApi.getSeriesList(count),
    enabled,
    staleTime,
  });
};
