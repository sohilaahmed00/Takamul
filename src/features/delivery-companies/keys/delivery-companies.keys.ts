export const deliveryCompaniesKeys = {
  all: ["delivery-companies"] as const,
  list: (params?: any) => [...deliveryCompaniesKeys.all, "list", params] as const,
  detail: (id: string | number) => [...deliveryCompaniesKeys.all, "detail", id] as const,
};
