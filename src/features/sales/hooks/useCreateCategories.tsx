"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/categories";
import type { CreateCategory } from "../types/categories.types";
import { categoriesKeys } from "../keys/categories.keys";

export function useCreateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategory) => createCategory(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.all,
      });
    },
    onError: (error) => {
      console.error("API ERROR ❌", error);
    },
  });
}
