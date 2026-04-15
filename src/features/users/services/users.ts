import { httpClient } from "@/api/httpClient";
import { CreateUser } from "../types/users.types";

// ===================
// GET
// ===================

// export const getAllAdditions = () => httpClient<GetAllAdditionsResponse>("/Additions");

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

// export const updateAddition = (id: number, data: createAddition) =>
//   httpClient<{ message: string }>(`/Additions/${id}`, {
//     method: "PUT",
//     data,
//   });

export const deleteAddition = (id: number) =>
  httpClient<{ message: string }>(`/Additions/${id}`, {
    method: "DELETE",
  });

// export function getCategoryById(id: number) {
//   return httpClient<Addition>(`/ProductCategories/${id}`);
// }
