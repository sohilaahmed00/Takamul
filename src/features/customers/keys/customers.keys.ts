// import type { PaginationMeta } from "@/types/common";

export const customersKeys = {
  all: ["customers"] as const,
  list: (params: { page: number; limit: number; searchTerm?: string }) => [...customersKeys.all, "list", params] as const,
  detail: (id: string | number) => [...customersKeys.all, "detail", id] as const,
};
