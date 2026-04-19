import { httpClient } from "@/api/httpClient";
import { CreateSalesReturns } from "../types/salesReturns.types";
import { GetAllSalesOrderResponse, SalesOrder } from "@/features/sales/types/sales.types";

// ===================
// GET
// ===================

export const getAllSalesOrders = ({ page = 1, limit = 5, OrderType }: { page: number; limit: number; OrderType?: "POS" | "A4" }) =>
  httpClient<GetAllSalesOrderResponse>(`/sales-orders`, {
    params: {
      Page: page,
      PageSize: limit,
      OrderType: OrderType,
    },
  });
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createSalesReturn = (data: CreateSalesReturns) =>
  httpClient<{ message: string }>("/sales-returns", {
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