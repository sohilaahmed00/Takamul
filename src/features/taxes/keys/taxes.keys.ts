export const taxesKeys = {
  all: ["taxes"] as const,
  list: () => [...taxesKeys.all, "list"] as const,
  detail: (id: string | number) => [...taxesKeys.all, "detail", id] as const,
};
