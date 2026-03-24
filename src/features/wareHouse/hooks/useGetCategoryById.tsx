// import { categoriesKeys } from "@/features/categories/keys/categories.keys";
// import { getCategoryById } from "@/features/categories/services/categories";
// import type { Category } from "@/features/categories/types/categories.types";
// import { useQuery } from "@tanstack/react-query";

// export const useGetCategoryById = (id?: string | number) =>
//   useQuery<Category>({
//     queryKey: categoriesKeys.detail(id as string | number),
//     queryFn: () => getCategoryById(id as number),
//     enabled: !!id,
//   });
