import { httpClient } from "@/api/httpClient";
import { GetAllCurrenciesResponse, Currency, CreateCurrency } from "../types/currencies.types";

export const getAllCurrencies = (params?: { Page?: number; PageSize?: number; SearchTerm?: string }) =>
  httpClient<GetAllCurrenciesResponse>("/settings/currencies", {
    params,
  });

export const getCurrencyById = (id: number) =>
  httpClient<{ success: boolean; data: Currency }>(`/settings/currencies/${id}`);

export const createCurrency = (data: CreateCurrency) =>
  httpClient<{ success: boolean; data: number }>("/settings/currencies", {
    method: "POST",
    data,
  });

export const updateCurrency = (id: number, data: CreateCurrency) =>
  httpClient<{ success: boolean; data: string }>(`/settings/currencies/${id}`, {
    method: "PUT",
    data,
  });

export const deleteCurrency = (id: number) =>
  httpClient<{ success: boolean; data: string }>(`/settings/currencies/${id}`, {
    method: "DELETE",
  });

export const setDefaultCurrency = (id: number) =>
  httpClient<{ success: boolean; data: string }>(`/settings/currencies/${id}/set-default`, {
    method: "PATCH",
  });
