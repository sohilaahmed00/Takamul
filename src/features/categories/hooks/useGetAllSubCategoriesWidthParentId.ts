import { useQuery } from "@tanstack/react-query";
import type { GetAllCategoriesResponse } from "../types/categories.types";
import { categoriesKeys } from "../keys/categories.keys";
import { getAllSubCategoriesWithParentId } from "../services/categories";

export const useGetAllSubCategoriesWidthParentId = (id: number) =>
  useQuery<GetAllCategoriesResponse>({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => getAllSubCategoriesWithParentId(id),
    enabled: !!id,
  });
