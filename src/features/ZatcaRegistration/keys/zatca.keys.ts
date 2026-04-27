// import type { PaginationMeta } from "@/types/common";

export const zatchaKeys = {
  all: ["zatcha"] as const,
  csr: () => [...zatchaKeys.all, "csr"] as const,
  tables: () => [...zatchaKeys.all, "tables"] as const,
  tablesFree: () => [...zatchaKeys.all, "tables", "free"] as const,
  table: (id) => [...zatchaKeys.all, "tables", id] as const,
  takwayOrders: () => [...zatchaKeys.all, "takwayOrders"] as const,
  DeliveryOrders: () => [...zatchaKeys.all, "DeliveryOrders"] as const,
  DineInOrders: () => [...zatchaKeys.all, "DineInOrders"] as const,

  detail: (id: string | number) => [...zatchaKeys.all, "detail", id] as const,
};
