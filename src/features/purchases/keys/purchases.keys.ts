// import type { PaginationMeta } from "@/types/common";

export const purchasesKeys = {
  all: ["sales"] as const,

  list: (param: { page: number; limit: number; searchTerm?: string }) => [...purchasesKeys.all, "list", param] as const,

  detail: (id: string | number) => [...purchasesKeys.all, "detail", id] as const,
};
