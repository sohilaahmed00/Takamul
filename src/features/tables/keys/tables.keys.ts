// import type { PaginationMeta } from "@/types/common";

export const tablesKeys = {
  all: ["tables"] as const,
  list: () => [...tablesKeys.all, "tables"] as const,
  tablesFree: () => [...tablesKeys.all, "tables", "free"] as const,
  table: (id) => [...tablesKeys.all, "tables", id] as const,
};
