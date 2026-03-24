import { httpClient } from "@/api/httpClient";
import type { CreateProduct, GetAllProductDirectResponse, GetAllProductRawMatrialResponse, GetAllProductsResponse, Product } from "../types/products.types";

// ===================
// GET
// ===================

export const getAllProductsDirect = () => httpClient<GetAllProductDirectResponse>("/Products/direct");
export const getAllProductsRawMatrial = () => httpClient<GetAllProductRawMatrialResponse>("/Products/raw-material");
export const getAllProductsBranched = () => httpClient<void>("/Products/branched");
export const getAllProductsPrepared = () => httpClient<void>("/Products/prepared");
export const getAllProducts = () => httpClient<GetAllProductsResponse>("/Products");

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createProductDirect = (data: FormData) =>
  httpClient<void>("/Products/direct", {
    method: "POST",
    data,
  });
export const createProductBranched = (data: FormData) =>
  httpClient<void>("/Products/branched", {
    method: "POST",
    data,
  });
export const createProductsRawMatrial = (data: FormData) =>
  httpClient<string>("/Products/raw-material", {
    method: "POST",
    data,
  });
export const createProductsPrepared = (data: FormData) =>
  httpClient<string>("/Products/prepared", {
    method: "POST",
    data,
  });

export const updateProduct = (id: number, data: FormData) =>
  httpClient<Product>(`/Products/${id}`, {
    method: "PUT",
    data,
  });

export const deleteSupplier = (id: number) =>
  httpClient<string>(`/Suppliers/${id}`, {
    method: "DELETE",
  });

export function getProductById(id: number) {
  return httpClient<Product>(`/Products/${id}`);
}
