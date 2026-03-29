export const expensesKeys = {
  all: ["expenses"] as const,
  list: (params: { page?: number; pageSize?: number; searchTerm?: string }) =>
    [...expensesKeys.all, "list", params] as const,
  detail: (id: number) => [...expensesKeys.all, "detail", id] as const,
};