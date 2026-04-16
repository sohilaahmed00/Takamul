import { httpClient } from "@/api/httpClient";
import { CreateRole, GetAllRolesResponse, Role, UpdateRole } from "../types/roles.types";

// ===================
// GET
// ===================

export const getAllRoles = (params: { page: number; limit: number }) =>
  httpClient<GetAllRolesResponse>(`/permissions/AllRoles`, {
    params: {
      PageSize: params.limit,
      PageNumber: params?.page,
    },
  });
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createRole = (data: CreateRole) =>
  httpClient<{ message: string }>(`/permissions/upsert`, {
    method: "POST",
    data,
  });
export const updateRole = (data: UpdateRole) =>
  httpClient<{ message: string }>(`/role-permissions/update`, {
    method: "POST",
    data,
  });
export const deleteRole = (roleName: string) =>
  httpClient<{ message: string }>(`/permissions/RemoveRole/${roleName}`, {
    method: "DELETE",
  });
export function getRoleById(id: number) {
  return httpClient<Role>(`/role-permissions/${id}`);
}

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
