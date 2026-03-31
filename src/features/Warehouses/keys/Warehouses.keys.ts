export const warehousesKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehousesKeys.all, "list"] as const,
  list: (filters: string) => [...warehousesKeys.lists(), { filters }] as const,
  details: () => [...warehousesKeys.all, "detail"] as const,
  detail: (id: number) => [...warehousesKeys.details(), id] as const,
};