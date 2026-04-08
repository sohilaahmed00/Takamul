// import type { PaginationMeta } from "@/types/common";

export const posKeys = {
  all: ["pos"] as const,

  tables: () => [...posKeys.all, "tables"] as const,
  table: (id) => [...posKeys.all, "tables", id] as const,
  takwayOrders: () => [...posKeys.all, "takwayOrders"] as const,
  DeliveryOrders: () => [...posKeys.all, "DeliveryOrders"] as const,
  DineInOrders: () => [...posKeys.all, "DineInOrders"] as const,

  detail: (id: string | number) => [...posKeys.all, "detail", id] as const,
};
