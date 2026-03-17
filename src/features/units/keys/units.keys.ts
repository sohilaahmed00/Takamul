export const unitsKeys = {
  all: ["units"] as const,
  lists: () => [...unitsKeys.all, "list"] as const,
  list: (params?: { page?: number; size?: number; search?: string }) =>
    [...unitsKeys.lists(), params] as const,
  details: () => [...unitsKeys.all, "detail"] as const,
  detail: (id: number) => [...unitsKeys.details(), id] as const,
};