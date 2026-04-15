// import type { PaginationMeta } from "@/types/common";

export const additionsKeys = {
  all: ["additions"] as const,
  list: () => [...additionsKeys.all, "list"] as const,
  detail: (id: string | number) => [...additionsKeys.all, "detail", id] as const,
};
