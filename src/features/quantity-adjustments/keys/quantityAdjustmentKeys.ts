export const quantityAdjustmentKeys = {
  all: ["quantity-adjustments"] as const,

  lists: () => [...quantityAdjustmentKeys.all, "list"] as const,
  list: (pageNumber: number, pageSize: number) =>
    [...quantityAdjustmentKeys.lists(), pageNumber, pageSize] as const,

  details: () => [...quantityAdjustmentKeys.all, "detail"] as const,
  detail: (id: number) => [...quantityAdjustmentKeys.details(), id] as const,

  stockInventories: ["stock-inventories-options"] as const,
  stockInventoryList: (pageNumber: number, pageSize: number, search?: string) =>
    [...quantityAdjustmentKeys.stockInventories, pageNumber, pageSize, search ?? ""] as const,
};