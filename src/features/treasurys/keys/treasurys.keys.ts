export const treasurysKeys = {
  all: ["treasurys"] as const,
  list: () => [...treasurysKeys.all, "list"] as const,
  detail: (id: string | number) => [...treasurysKeys.all, "detail", id] as const,
};