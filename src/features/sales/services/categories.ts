import { httpClient } from "@/api/httpClient";
import type { CreateResponse, PaginationMeta } from "@/types/common";
import type { GetAllSalesOrderResponse } from "../types/categories.types";

// ===================
// GET
// ===================

export const getAllSalesOrders = () => httpClient<GetAllSalesOrderResponse>("/SalesOrders");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createCategory = (data: CreateCategory) =>
//   httpClient<GetAllCategoriesResponse>("/blog/category", {
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

// export function getCategoryById(id: string | number) {
//   return httpClient<Category>(`/blog/category/${id}`);
// }
