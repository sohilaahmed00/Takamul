// import type { PaginationMeta } from "@/types/common";

export const customersKeys = {
  all: ["customers"] as const,
  list: () => [...customersKeys.all, "list"] as const,
  detail: (id: string | number) => [...customersKeys.all, "detail", id] as const,
};
