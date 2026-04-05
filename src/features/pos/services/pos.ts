import { httpClient } from "@/api/httpClient";
import { CreateDeliveryOrder, CreateTakeawayOrder } from "../types/pos.types";

// ===================
// GET
// ===================

// export const getAllSalesOrders = (page: number, limit: number) => httpClient<GetAllSalesOrderResponse>(`/sales-orders?page=${page}&pageSize=${limit}`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createTakwayOrder = (data: CreateTakeawayOrder) =>
  httpClient<{ message: string }>("/sales-orders/pos/takeaway", {
    method: "POST",
    data,
  });
export const createDeliveryOrder = (data: CreateDeliveryOrder) =>
  httpClient<{ message: string }>("/sales-orders/pos/delivery", {
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

// export function getSalesOrderById(id: number) {
//   return httpClient<SalesOrder>(`/sales-orders/${id}`);
// }
