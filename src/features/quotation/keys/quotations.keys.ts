// import type { PaginationMeta } from "@/types/common";

export const quotationsKeys = {
  all: ["quotations"] as const,

  list: (params: { page?: number; limit?: number }) => [...quotationsKeys.all, "list", params] as const,

  detail: (id: string | number) => [...quotationsKeys.all, "detail", id] as const,
};
