export const quantityAdjustmentKeys = {
  all: ["quantity-adjustments"] as const,
  list: (params: { pageNumber?: number; pageSize?: number; searchTerm?: string }) => [...quantityAdjustmentKeys.all, "list", params] as const,
  details: () => [...quantityAdjustmentKeys.all, "detail"] as const,
  detail: (id: number) => [...quantityAdjustmentKeys.details(), id] as const,
  stockInventories: ["stock-inventories-options"] as const,
  stockInventoryList: (params: { pageNumber: number; pageSize: number; searchTerm?: string }) => [...quantityAdjustmentKeys.stockInventories, params] as const,
};
