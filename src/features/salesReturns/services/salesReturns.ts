import { httpClient } from "@/api/httpClient";
import { CreateSalesReturns, GetAllSalesReturnResponse } from "../types/salesReturns.types";
import { GetAllSalesOrderResponse, SalesOrder } from "@/features/sales/types/sales.types";

// ===================
// GET
// ===================

export const getAllSalesReturnOrders = ({ page = 1, limit = 5, searchTerm }: { page: number; limit: number; searchTerm?: string }) =>
  httpClient<GetAllSalesReturnResponse>(`/sales-returns`, {
    params: {
      Page: page,
      PageSize: limit,
      SearchTerm: searchTerm,
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

export const deleteSalesReturn = (id: number) =>
  httpClient<void>(`/blog/category/${id}`, {
    method: "DELETE",
  });

export function getSalesOrderById(id: number) {
  return httpClient<SalesOrder>(`/sales-orders/${id}`);
}
