export const quantityAdjustmentKeys = {
  all: ["quantity-adjustments"] as const,
  lists: (pageNumber: number, pageSize: number) => [...quantityAdjustmentKeys.all, "list", pageNumber, pageSize] as const,
  details: () => [...quantityAdjustmentKeys.all, "detail"] as const,
  detail: (id: number) => [...quantityAdjustmentKeys.details(), id] as const,
  stockInventories: ["stock-inventories-options"] as const,
  stockInventoryList: (pageNumber: number, pageSize: number, search?: string) => [...quantityAdjustmentKeys.stockInventories, pageNumber, pageSize, search ?? ""] as const,
};
