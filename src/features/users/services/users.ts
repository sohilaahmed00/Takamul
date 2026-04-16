import { httpClient } from "@/api/httpClient";
import { CreateUser, GetAllUsersResponse, UpdateUser } from "../types/users.types";

// ===================
// GET
// ===================

export const getAllUsers = (params: { page: number; limit: number; searchTerm?: string }) =>
  httpClient<GetAllUsersResponse>("/employees/GetAllUsers", {
    params: {
      PageSize: params?.limit,
      Page: params?.page,
      SearchTerm: params?.searchTerm,
    },
  });

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createUser = (data: CreateUser) =>
  httpClient<{ message: string }>("/employees/createuser", {
    method: "POST",
    data,
  });

export const updateUser = (id: number, data: UpdateUser) =>
  httpClient<{ message: string }>(`/employees/${id}/user`, {
    method: "PUT",
    data,
  });

export const deleteUser = (id: number) =>
  httpClient<{ message: string }>(`/Additions/${id}`, {
    method: "DELETE",
  });

// export function getCategoryById(id: number) {
//   return httpClient<Addition>(`/ProductCategories/${id}`);
// }
