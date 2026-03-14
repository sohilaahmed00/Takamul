"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../services/customers";
import type { CreateCategory } from "../types/categories.types";
import { categoriesKeys } from "../keys/categories.keys";

type UpdateCategoryPayload = {
  id: number;
  data: CreateCategory;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryPayload) => updateCategory(id, data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.all,
      });
    },
    onError: (error) => {
      console.error("API ERROR ", error);
    },
  });
}
