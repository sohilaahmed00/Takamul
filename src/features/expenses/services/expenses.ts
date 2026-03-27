import { httpClient } from "@/api/httpClient";
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
