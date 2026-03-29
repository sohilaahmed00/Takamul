export const itemsKeys = {
  all: ["items"] as const,
  list: (params: { page?: number; pageSize?: number; searchTerm?: string }) =>
    [...itemsKeys.all, "list", params] as const,
  detail: (id: number) => [...itemsKeys.all, "detail", id] as const,
};