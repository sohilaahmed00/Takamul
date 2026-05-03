import { httpClient } from "@/api/httpClient";
import { CategoryDiscount, CategoryDiscountResponse, CreateCategoryDiscountRequest, UpdateCategoryDiscountRequest } from "../types/category-discount.types";

export const getAllCategoryDiscounts = (params?: { Page?: number; PageSize?: number; IsActive?: boolean; CategoryId?: number }) =>
  httpClient<CategoryDiscountResponse>("/CategoryDiscount", {
    params,
  });

export const getCategoryDiscountById = (id: number) =>
  httpClient<CategoryDiscount>(`/CategoryDiscount/${id}`);

export const createCategoryDiscount = (data: CreateCategoryDiscountRequest) =>
  httpClient<CategoryDiscount>("/CategoryDiscount", {
    method: "POST",
    data,
  });

export const updateCategoryDiscount = (id: number, data: UpdateCategoryDiscountRequest) =>
  httpClient<CategoryDiscount>(`/CategoryDiscount/${id}`, {
    method: "PUT",
    data,
  });

export const deactivateCategoryDiscount = (id: number) =>
  httpClient<string>(`/CategoryDiscount/${id}/DeactivateAsync`, {
    method: "PUT",
  });
