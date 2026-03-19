// import type { PaginationMeta } from "@/types/common";

export const unitsKeys = {
  all: ["units"] as const,
  list: () => [...unitsKeys.all, "list"] as const,
  detail: (id: string | number) => [...unitsKeys.all, "detail", id] as const,
};
