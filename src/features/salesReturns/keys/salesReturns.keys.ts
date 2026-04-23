// import type { PaginationMeta } from "@/types/common";

export const salesReturnsKeys = {
  all: ["salesReturns"] as const,

  list: (params: { page: number; limit: number; searchTerm?: string }) => [...salesReturnsKeys.all, "list", params] as const,

  detail: (id: number) => [...salesReturnsKeys.all, "detail", id] as const,
};
