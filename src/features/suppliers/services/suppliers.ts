import { httpClient } from "@/api/httpClient";
import type { createSupplier, GetAllSuppliersResponse, Supplier } from "../types/suppliers.types";

// ===================
// GET
// ===================

export const getAllSuppliers = () => httpClient<GetAllSuppliersResponse>("/Suppliers");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createSuppliers = (data: createSupplier) =>
  httpClient<{ message: string }>("/Suppliers", {
    method: "POST",
    data,
  });

export const updateSupplier = (id: number, data: createSupplier) =>
  httpClient<string>(`/Suppliers/${id}`, {
    method: "PUT",
    data,
  });

export const deleteSupplier = (id: number) =>
  httpClient<string>(`/Suppliers/${id}`, {
    method: "DELETE",
  });

export function getSupplierById(id: number) {
  return httpClient<Supplier>(`/Suppliers/${id}`);
}
