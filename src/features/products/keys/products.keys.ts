// import type { PaginationMeta } from "@/types/common";

export const productsKeys = {
  all: ["Products"] as const,
  list: (param: { limit: number; page: number; SearchTerm?: string }) => [...productsKeys.all, "list", param] as const,
  rawMatrial: (param: { limit: number; page: number; SearchTerm?: string }) => [...productsKeys.all, "raw-matrial", param] as const,
  direct: (param: { limit: number; page: number; SearchTerm?: string }) => [...productsKeys.all, "direct", param] as const,
  branch: (param: { limit: number; page: number; SearchTerm?: string }) => [...productsKeys.all, "branch", param] as const,
  prepared: (param: { limit: number; page: number; SearchTerm?: string }) => [...productsKeys.all, "prepared", param] as const,
  detail: (id: string | number) => [...productsKeys.all, "detail", id] as const,
};
