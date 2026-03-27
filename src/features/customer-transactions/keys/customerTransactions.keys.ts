export const customerTransactionsKeys = {
  all: ["customer-transactions"] as const,
  totalByCustomer: (customerId?: number) =>
    ["customer-transactions", "total-by-customer", customerId] as const,
};