export const supplierTransactionsKeys = {
  all: ["supplier-transactions"] as const,
  lists: () => [...supplierTransactionsKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...supplierTransactionsKeys.lists(), filters] as const,
  details: () => [...supplierTransactionsKeys.all, "detail"] as const,
  detail: (id: number) => [...supplierTransactionsKeys.details(), id] as const,
  totalBySupplier: (supplierId?: number) => [...supplierTransactionsKeys.all, "totalBySupplier", supplierId] as const,
}