// import type { PaginationMeta } from "@/types/common";

export const salesKeys = {
  all: ["sales"] as const,
  list: () => [...salesKeys.all, "list"] as const,
  detail: (id: string | number) => [...salesKeys.all, "detail", id] as const,
};
