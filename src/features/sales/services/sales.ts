import { httpClient } from "@/api/httpClient";
import type { CreateSalesOrder, GetAllSalesOrderResponse, SalesOrder } from "../types/sales.types";

// ===================
// GET
// ===================

export const getAllSalesOrders = ({ page = 1, limit = 5, OrderType, SearchTerm }: { page: number; limit: number; SearchTerm?: string; OrderType?: "POS" | "A4" }) =>
  httpClient<GetAllSalesOrderResponse>(`/sales-orders`, {
    params: {
      Page: page,
      PageSize: limit,
      OrderType: OrderType,
      SearchTerm: SearchTerm,
    },
  });
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

export function getSalesOrderById(id: number) {
  return httpClient<SalesOrder>(`/sales-orders/${id}`);
}
