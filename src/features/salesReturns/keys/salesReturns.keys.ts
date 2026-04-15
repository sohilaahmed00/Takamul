// import type { PaginationMeta } from "@/types/common";

export const salesReturnsKeys = {
  all: ["salesReturns"] as const,

  list: () => [...salesReturnsKeys.all, "list"] as const,

  detail: (id: number) => [...salesReturnsKeys.all, "detail", id] as const,
};
