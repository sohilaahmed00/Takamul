export const branchesKeys = {
  all: ["branches"] as const,
  detail: (id: number) => [...branchesKeys.all, "detail", id] as const,
};