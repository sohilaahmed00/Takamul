import { httpClient } from "@/api/httpClient";
import type { createCustomer, GetAllCustomersResponse } from "../types/customers.types";

// ===================
// GET
// ===================

export const getAllCustomers = () => httpClient<GetAllCustomersResponse>("/Customer");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createCustomers = (data: createCustomer) =>
  httpClient<GetAllCustomersResponse>("/Customer", {
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
