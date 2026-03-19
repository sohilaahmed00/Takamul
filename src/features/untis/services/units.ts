import { httpClient } from "@/api/httpClient";
import type { GetAllUnitsResponse } from "../types/untis.types";

// ===================
// GET
// ===================

export const getAllUnits = () => httpClient<GetAllUnitsResponse>("/UnitOfMeasure");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createSuppliers = (data: createSupplier) =>
//   httpClient<GetAllSuppliersResponse>("/Suppliers", {
//     method: "POST",
//     data,
//   });

// export const updateSupplier = (id: number, data: createSupplier) =>
//   httpClient<Supplier>(`/Suppliers/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteSupplier = (id: number) =>
//   httpClient<string>(`/Suppliers/${id}`, {
//     method: "DELETE",
//   });

// export function getSupplierById(id: number) {
//   return httpClient<Supplier>(`/Suppliers/${id}`);
// }
