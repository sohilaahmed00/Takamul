import { httpClient } from "@/api/httpClient";
import type { Category, GetAllCategoriesResponse } from "../types/categories.types";
import type { CreateCategory } from "@/features/sales/types/categories.types";

// ===================
// GET
// ===================

export const getAllCategories = () => httpClient<GetAllCategoriesResponse>("/ProductCategories");
export const getAllMainCategories = () => httpClient<GetAllCategoriesResponse>("/ProductCategories/MainCategory");
export const getAllSubCategoriesWithParentId = (id: number) => httpClient<GetAllCategoriesResponse>(`/ProductCategories/SubCategory/${id}`);

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createCategory = (data: FormData) =>
  httpClient<GetAllCategoriesResponse>("/ProductCategories/create", {
    method: "POST",
    data,
  });

export const updateCategory = (id: number, data: FormData) =>
  httpClient<Category>(`/ProductCategories/${id}`, {
    method: "PUT",
    data,
  });

// export const deleteSupplier = (id: number) =>
//   httpClient<string>(`/Suppliers/${id}`, {
//     method: "DELETE",
//   });

export function getCategoryById(id: number) {
  return httpClient<Category>(`/ProductCategories/${id}`);
}
