import { httpClient } from "@/api/httpClient";
import type { CreateSalesOrder, GetAllSalesOrderResponse } from "../types/sales.types";

// ===================
// GET
// ===================

export const getAllSalesOrders = (page: number, limit: number) => httpClient<GetAllSalesOrderResponse>(`/sales-orders?page=${page}&pageSize=${limit}`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createSalesOrders = (data: CreateSalesOrder) =>
  httpClient<{ message: string }>("/sales-orders", {
    method: "POST",
    data,
  });

// export const updateCategory = (id: number, data: CreateCategory) =>
//   httpClient<CreateResponse>(`/blog/category/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getCategoryById(id: string | number) {
//   return httpClient<Category>(`/blog/category/${id}`);
// }
