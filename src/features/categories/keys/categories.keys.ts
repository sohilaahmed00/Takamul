// import type { PaginationMeta } from "@/types/common";

export const categoriesKeys = {
  all: ["categories"] as const,
  list: () => [...categoriesKeys.all, "list"] as const,
  mainCategories: () => [...categoriesKeys.all, "main"] as const,
  subCategories: () => [...categoriesKeys.all, "sub"] as const,
  detail: (id: string | number) => [...categoriesKeys.all, "detail", id] as const,
};
