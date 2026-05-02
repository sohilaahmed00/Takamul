import { httpClient } from "@/api/httpClient";
import type { GetAllTaxesResponse, Tax, CreateTax } from "../types/taxes.types";

// ===================
// GET
// ===================

export const getAllTaxes = () => httpClient<GetAllTaxesResponse>("/Taxes");

export function getTaxById(id: number) {
  return httpClient<Tax>(`/Taxes/${id}`);
}

// ===================
// MUTATIONS
// ===================

export const createTax = (data: CreateTax) =>
  httpClient<Tax>("/Taxes", {
    method: "POST",
    data,
  });

export const updateTax = (id: number, data: CreateTax) =>
  httpClient<Tax>(`/Taxes/${id}`, {
    method: "PUT",
    data,
  });

export const deleteTax = (id: number) =>
  httpClient<void>(`/Taxes/${id}`, {
    method: "DELETE",
  });
