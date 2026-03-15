import { httpClient } from "@/api/httpClient";
import type { createCustomer, Customer, GetAllCustomersResponse } from "../types/customers.types";

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

export const updateCustomer = (id: number, data: createCustomer) =>
  httpClient<Customer>(`/Customer/${id}`, {
    method: "PUT",
    data,
  });

export const deleteCustomer = (id: number) =>
  httpClient<string>(`/Customer/${id}`, {
    method: "DELETE",
  });

export function getCustomerById(id: number) {
  return httpClient<Customer>(`/Customer/${id}`);
}
