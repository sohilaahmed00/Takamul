import { httpClient } from "@/api/httpClient";
<<<<<<< HEAD
import type {
  Expense,
  ExpensesResponse,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../types/Expenses.types";

export const getAllExpenses = (
  params: { page?: number; pageSize?: number; searchTerm?: string } = {}
) => {
  const qs = new URLSearchParams();
  if (params.page) qs.append("Page", String(params.page));
  if (params.pageSize) qs.append("PageSize", String(params.pageSize));
  if (params.searchTerm) qs.append("SearchTerm", params.searchTerm);
  const query = qs.toString();
  return httpClient<ExpensesResponse>(`/Expenses${query ? `?${query}` : ""}`);
};

export const getExpenseById = (id: number) =>
  httpClient<Expense>(`/Expenses/${id}`);

export const createExpense = (data: CreateExpensePayload) =>
  httpClient<string>("/Expenses", { method: "POST", data });

export const updateExpense = (id: number, data: Omit<UpdateExpensePayload, "id">) =>
  httpClient<string>(`/Expenses/${id}`, { method: "PUT", data });

export const deleteExpense = (id: number) =>
  httpClient<string>(`/Expenses/${id}`, { method: "DELETE" });
=======
import type { GetAllExpenseResponse } from "../types/expenses.types";

// ===================
// GET
// ===================

export const getAllExpense = (page: number, limit: number) => httpClient<GetAllExpenseResponse>(`/Expenses?page=${page}&pageSize=${limit}`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createSalesOrders = (data: CreateSalesOrder) =>
//   httpClient<{ message: string }>("/sales-orders", {
//     method: "POST",
//     data,
//   });

// export const updateCategory = (id: number, data: CreateCategory) =>
//   httpClient<CreateResponse>(`/blog/category/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getSalesOrderById(id: number) {
//   return httpClient<SalesOrder>(`/sales-orders/${id}`);
// }
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
