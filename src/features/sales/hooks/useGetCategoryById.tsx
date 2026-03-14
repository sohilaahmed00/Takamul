"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesKeys } from "../keys/categories.keys";
import type { Category } from "../types/categories.types";
import { getCategoryById } from "../services/categories";

export const useGetCategoryById = (id?: string | number) =>
  useQuery<Category>({
    queryKey: categoriesKeys.detail(id as string | number),
    queryFn: () => getCategoryById(id as string | number),
    enabled: !!id,
  });
