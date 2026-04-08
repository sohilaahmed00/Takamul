import { httpClient } from "@/api/httpClient";
import { CheckoutDineInOrder, CreateDeliveryOrder, CreateDineInOrder, CreateTakeawayOrder, GetAllTablesResponse, GetOrderByTableIdResponse } from "../types/pos.types";

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
export const createDineInOrder = (data: CreateDineInOrder) =>
  httpClient<{ message: string }>("/sales-orders/pos/indine", {
    method: "POST",
    data,
  });
export const checkoutDineInOrder = (data: CheckoutDineInOrder) =>
  httpClient<{ message: string }>("/sales-orders/pos/indine/checkout", {
    method: "POST",
    data,
  });
export const getOrderByTableId = (id: number) =>
  httpClient<GetOrderByTableIdResponse>(`/sales-orders/pos/indine/table/${id}`, {
    method: "GET",
  });
export const getAllTables = () =>
  httpClient<GetAllTablesResponse>("/dining-tables", {
    method: "GET",
  });
export const getAllFreeTables = () =>
  httpClient<GetAllTablesResponse>("/dining-tables/free", {
    method: "GET",
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
