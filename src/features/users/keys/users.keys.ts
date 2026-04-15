// import type { PaginationMeta } from "@/types/common";

export const usersKeys = {
  all: ["users"] as const,
  list: () => [...usersKeys.all, "list"] as const,
  detail: (id: string | number) => [...usersKeys.all, "detail", id] as const,
};
