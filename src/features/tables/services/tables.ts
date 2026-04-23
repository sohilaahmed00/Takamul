import { httpClient } from "@/api/httpClient";
import { CreateTable, GetAllTablesResponse } from "../types/tables.types";

// ===================
// GET
// ===================

// export const getAllSalesOrders = (page: number, limit: number) => httpClient<GetAllSalesOrderResponse>(`/sales-orders?page=${page}&pageSize=${limit}`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const addTable = (data: CreateTable) =>
  httpClient<{ message: string }>(`/dining-tables`, {
    method: "POST",
    data,
  });
export const updateTable = ({ data, id }: { data: CreateTable; id: number }) =>
  httpClient<{ message: string }>(`/dining-tables/${id}`, {
    method: "PUT",
    data,
  });

export const getAllTables = () =>
  httpClient<GetAllTablesResponse>("/dining-tables", {
    method: "GET",
  });
export const getAllFreeTables = () =>
  httpClient<GetAllTablesResponse>("/dining-tables/free", {
    method: "GET",
  });

export const deleteTable = (id: number) =>
  httpClient<{ message: string }>(`/dining-tables/${id}`, {
    method: "DELETE",
  });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getSalesOrderById(id: number) {
//   return httpClient<SalesOrder>(`/sales-orders/${id}`);
// }
