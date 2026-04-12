import { httpClient } from "@/api/httpClient";
import { Permissions } from "../types/permissions.types";

// ===================
// GET
// ===================

export const getAllPermissions = () => httpClient<Permissions>("/Auth/GetAllPermissions");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const createAdditions = (data: createAddition) =>
//   httpClient<{ message: string }>("/Additions", {
//     method: "POST",
//     data,
//   });

// export const updateAddition = (id: number, data: createAddition) =>
//   httpClient<{ message: string }>(`/Additions/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteAddition = (id: number) =>
//   httpClient<{ message: string }>(`/Additions/${id}`, {
//     method: "DELETE",
//   });

// export function getCategoryById(id: number) {
//   return httpClient<Addition>(`/ProductCategories/${id}`);
// }
