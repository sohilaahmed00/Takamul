// import type { PaginationMeta } from "@/types/common";

export const salesKeys = {
  all: ["sales"] as const,

  list: (params: { page: number; limit: number; OrderType: "POS" | "A4"; SearchTerm: string }) => [...salesKeys.all, "list", params] as const,

  detail: (id: string | number) => [...salesKeys.all, "detail", id] as const,
};
