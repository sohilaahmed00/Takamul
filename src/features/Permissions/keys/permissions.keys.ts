// import type { PaginationMeta } from "@/types/common";

export const permissionsKeys = {
  all: ["permissions"] as const,
  list: () => [...permissionsKeys.all, "list"] as const,
  detail: (id: string | number) => [...permissionsKeys.all, "detail", id] as const,
};
