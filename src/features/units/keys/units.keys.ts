export const unitsKeys = {
  all: ["units"] as const,
  list: (params?: { page?: number; size?: number; search?: string }) => [...unitsKeys.all, "list", params] as const,
  details: () => [...unitsKeys.all, "detail"] as const,
  detail: (id: number) => [...unitsKeys.details(), id] as const,
};
