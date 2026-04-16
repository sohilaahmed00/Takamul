// import type { PaginationMeta } from "@/types/common";

export const usersKeys = {
  all: ["users"] as const,
  list: (params: { page: number; limit: number; searchTerm: string }) => [...usersKeys.all, "list", params] as const,
  detail: (id: string | number) => [...usersKeys.all, "detail", id] as const,
};
