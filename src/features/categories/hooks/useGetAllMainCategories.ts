import { useQuery } from "@tanstack/react-query";
import type { GetAllCategoriesResponse } from "../types/categories.types";
import { categoriesKeys } from "../keys/categories.keys";
import { getAllMainCategories } from "../services/categories";

export const useGetAllMainCategories = () =>
  useQuery<GetAllCategoriesResponse>({
    queryKey: categoriesKeys.list(),
    queryFn: () => getAllMainCategories(),
  });
