import { httpClient } from "@/api/httpClient";
import { SettingsResponse } from "../types/settings.types";

// ===================
// GET
// ===================

export const getAllSettings = () => httpClient<SettingsResponse>(`/Settings`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createSalesOrders = (data: CreateSalesOrder) =>
//   httpClient<{ message: string }>("/sales-orders/a4", {
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
