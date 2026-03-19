// import type { PaginationMeta } from "@/types/common";

export const productsKeys = {
  all: ["Products"] as const,
  list: () => [...productsKeys.all, "list"] as const,
  rawMatrial: () => [...productsKeys.all, "raw-matrial"] as const,
  detail: (id: string | number) => [...productsKeys.all, "detail", id] as const,
};
