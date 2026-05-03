export const categoryDiscountKeys = {
  all: ["category-discounts"] as const,
  lists: () => [...categoryDiscountKeys.all, "list"] as const,
  list: (params: any) => [...categoryDiscountKeys.lists(), params] as const,
  details: () => [...categoryDiscountKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryDiscountKeys.details(), id] as const,
};
