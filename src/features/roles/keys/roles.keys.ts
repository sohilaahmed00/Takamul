// import type { PaginationMeta } from "@/types/common";

export const rolesKeys = {
  all: ["roles"] as const,

  list: (params: { page: number; limit: number }) => [...rolesKeys.all, "list", params] as const,

  detail: (id: string | number) => [...rolesKeys.all, "detail", id] as const,
};
