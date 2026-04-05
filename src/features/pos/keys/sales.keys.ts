// import type { PaginationMeta } from "@/types/common";

export const salesKeys = {
  all: ["sales"] as const,

  list: (params: { page: number; limit: number }) => [...salesKeys.all, "list", params] as const,

  detail: (id: string | number) => [...salesKeys.all, "detail", id] as const,
};
