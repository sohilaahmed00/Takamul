import { useQuery } from "@tanstack/react-query";
import type { GetAllCategoriesResponse } from "../types/categories.types";
import { categoriesKeys } from "../keys/categories.keys";
import { getAllCategories, getAllMainCategories } from "../services/categories";

export const useGetAllCategories = () =>
  useQuery<GetAllCategoriesResponse>({
    queryKey: categoriesKeys.list(),
    queryFn: () => getAllCategories(),
  });
