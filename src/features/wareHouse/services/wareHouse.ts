import { httpClient } from "@/api/httpClient";
import type { GetAllWareHousesResponse } from "../types/wareHouse.types";

// ===================
// GET
// ===================

export const getAllWareHouses = () => httpClient<GetAllWareHousesResponse>("/Warehouse");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createSalesOrders = (data: CreateSalesOrder) =>
//   httpClient<void>("/sales-orders", {
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
