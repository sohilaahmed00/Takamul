// import type { PaginationMeta } from "@/types/common";

export const expenseKeys = {
  all: ["expense"] as const,

  list: (params: { page: number; limit: number }) => [...expenseKeys.all, "list", params] as const,

  detail: (id: string | number) => [...expenseKeys.all, "detail", id] as const,
};
