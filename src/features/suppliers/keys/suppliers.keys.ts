// import type { PaginationMeta } from "@/types/common";

export const suppliersKeys = {
  all: ["suppliers"] as const,
  list: () => [...suppliersKeys.all, "list"] as const,
  detail: (id: string | number) => [...suppliersKeys.all, "detail", id] as const,
};
