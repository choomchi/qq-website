"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/services/query-keys";

export const useInvalidatePersons = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.persons.all() });
    },
  });
};
