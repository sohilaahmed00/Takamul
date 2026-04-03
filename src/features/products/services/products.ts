import { httpClient } from "@/api/httpClient";
import type { CreateProduct, GetAllProductBranchedResponse, GetAllProductDirectResponse, GetAllProductPreparedResponse, GetAllProductRawMatrialResponse, GetAllProductsResponse, Product, ProductBranch, ProductDirect, ProductPrepared, ProductRawMatrial } from "../types/products.types";

// ===================
// GET
// ===================

export const getAllProductsDirect = (page: number, limit: number, SearchTerm?: string) =>
  httpClient<GetAllProductDirectResponse>("/Products/direct", {
    params: { Page: page, PageSize: limit, SearchTerm: SearchTerm },
  });
export const getAllProductsRawMatrial = (page: number, limit: number, SearchTerm?: string) =>
  httpClient<GetAllProductRawMatrialResponse>("/Products/raw-material", {
    params: { Page: page, PageSize: limit, SearchTerm: SearchTerm },
  });
export const getAllProductsBranched = (page: number, limit: number, SearchTerm?: string) =>
  httpClient<GetAllProductBranchedResponse>("/Products/branched", {
    params: { Page: page, PageSize: limit, SearchTerm: SearchTerm },
  });
export const getAllProductsPrepared = (page: number, limit: number, SearchTerm?: string) =>
  httpClient<GetAllProductPreparedResponse>("/Products/prepared", {
    params: { Page: page, PageSize: limit, SearchTerm: SearchTerm },
  });
export const getAllProducts = async (page: number, limit: number, SearchTerm?: string) =>
  httpClient<GetAllProductsResponse>("/Products", {
    params: { Page: page, PageSize: limit, SearchTerm: SearchTerm },
  });
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

export const createProductDirect = (data: FormData) =>
  httpClient<string>("/Products/direct", {
    method: "POST",
    data,
  });
export const createProductBranched = (data: FormData) =>
  httpClient<string>("/Products/branched", {
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
  httpClient<{ message: string }>(`/Products/${id}`, {
    method: "PUT",
    data,
  });
export const updateProductBranched = (id: number, data: FormData) =>
  httpClient<string>(`/Products/branched/${id}`, {
    method: "PUT",
    data,
  });
export const updateProductDirect = (id: number, data: FormData) =>
  httpClient<string>(`/Products/direct/${id}`, {
    method: "PUT",
    data,
  });
export const updateProductPrepared = (id: number, data: FormData) =>
  httpClient<{ message: string }>(`/Products/prepared/${id}`, {
    method: "PUT",
    data,
  });
export const updateProductRawMeterial = (id: number, data: FormData) =>
  httpClient<{ message: string }>(`/Products/raw-material/${id}`, {
    method: "PUT",
    data,
  });

export const deleteProduct = (id: number) =>
  httpClient<{ message: string }>(`/Products/${id}`, {
    method: "DELETE",
  });

export function getProductById(id: number) {
  return httpClient<Product>(`/Products/${id}`);
}
export function getProductBranchedById(id: number) {
  return httpClient<ProductBranch>(`/Products/branched/${id}`);
}
export function getProductDirectById(id: number) {
  return httpClient<ProductDirect>(`/Products/direct/${id}`);
}
export function getProductPreparedById(id: number) {
  return httpClient<ProductPrepared>(`/Products/prepared/${id}`);
}
export function getProductRawMaterialById(id: number) {
  return httpClient<ProductRawMatrial>(`/Products/raw-material/${id}`);
}
