import { useQuery } from "@tanstack/react-query";
import type { GetAllCategoriesResponse } from "@/features/categories/types/categories.types";
import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { getAllSubCategoriesWithParentId } from "@/features/categories/services/categories";

export const useGetAllSubCategoriesWidthParentId = (id: number) =>
  useQuery<GetAllCategoriesResponse>({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => getAllSubCategoriesWithParentId(id),
    enabled: !!id,
  });
