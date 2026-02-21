"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/query-keys";
import { personsApi } from "./persons-api";

export type UseGetPersonsOptions = {
  count?: number;
  enabled?: boolean;
  staleTime?: number;
};

export const useGetWritersAndTranslators = ({
  count = 20,
  enabled = true,
  staleTime = 60_000,
}: UseGetPersonsOptions = {}) => {
  return useQuery({
    queryKey: queryKeys.persons.all(),
    queryFn: () => personsApi.getWritersAndTranslators(count),
    enabled,
    staleTime,
  });
};
