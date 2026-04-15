import { httpClient } from "@/api/httpClient";
import { CreateRole, UpdateRole } from "../types/roles.types";

// ===================
// GET
// ===================

// export const getAllRoles = () => httpClient<GetAllQuotationsResponse>(`/permissions/AllRoles`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createRole = (data: CreateRole) =>
  httpClient<{ message: string }>(`/permissions/Create/${data?.roleName}`, {
    method: "POST",
  });
export const updateRole = (data: UpdateRole) =>
  httpClient<{ message: string }>(`/role-permissions/update`, {
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
