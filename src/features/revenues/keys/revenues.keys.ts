export const revenuesKeys = {
  all: ["revenues"] as const,
  detail: (id: number) => [...revenuesKeys.all, "detail", id] as const,
};