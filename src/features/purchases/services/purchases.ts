import { httpClient } from "@/api/httpClient";
<<<<<<< HEAD
import type { CreatePurchaseOrder, GetAllPurchasesResponse } from "../types/purchase.types";
=======
import type { CreatePurchaseOrder, GetAllPurchasesResponse, Purchase } from "../types/purchase.types";
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683

// ===================
// GET
// ===================

export const getAllPurchases = (page: number, limit: number, searchTerm?: string) =>
  httpClient<GetAllPurchasesResponse>(`/PurchaseOrder`, {
    params: { Page: page, PageSize: limit, SearchTerm: searchTerm },
  });
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createPurchaseOrder = (data: CreatePurchaseOrder) =>
  httpClient<{ message: string }>("/PurchaseOrder", {
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

<<<<<<< HEAD
// export function getCategoryById(id: string | number) {
//   return httpClient<Category>(`/blog/category/${id}`);
// }
=======
export function getPurchaseOrderById(id: number) {
  return httpClient<Purchase>(`/PurchaseOrder/${id}`);
}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
