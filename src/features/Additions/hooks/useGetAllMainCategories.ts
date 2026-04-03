import { useQuery } from "@tanstack/react-query";
import type { GetAllCategoriesResponse } from "@/features/categories/types/categories.types";
import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getAllMainCategories } from "@/features/categories/services/categories";

export const useGetAllMainCategories = () =>
  useQuery<GetAllCategoriesResponse>({
    queryKey: categoriesKeys.list(),
    queryFn: () => getAllMainCategories(),
  });
