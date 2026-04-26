// import type { PaginationMeta } from "@/types/common";

export const settingsKeys = {
  all: ["Settings"] as const,
  list: () => [...settingsKeys.all, "list"] as const,
  detail: (id: string | number) => [...settingsKeys.all, "detail", id] as const,
};
