import { httpClient } from "@/api/httpClient";
import type { CreateQuotation, GetAllQuotationsResponse, Quotation } from "../types/quotations.types";

// ===================
// GET
// ===================

export const getAllQuotations = (page?: number, limit?: number) => httpClient<GetAllQuotationsResponse>(`/Quotation`);
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createQuotation = (data: CreateQuotation) =>
  httpClient<{ message: string }>("/Quotation", {
    method: "POST",
    data,
  });

export const getQuotationById = (id: number) =>
  httpClient<Quotation>(`/Quotation/${id}`, {
    method: "GET",
  });
export const updateQuotation = (id: number, data: CreateQuotation) =>
  httpClient<{ message: string }>(`/Quotation/${id}`, {
    method: "PUT",
    data,
  });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getCategoryById(id: string | number) {
//   return httpClient<Category>(`/blog/category/${id}`);
// }
