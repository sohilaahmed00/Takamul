import { httpClient } from "@/api/httpClient";
import { GetAllDeliveryCompaniesResponse, DeliveryCompany, CreateDeliveryCompany } from "../types/delivery-companies.types";

export const getAllDeliveryCompanies = (params?: { Page?: number; PageSize?: number; SearchTerm?: string }) =>
  httpClient<GetAllDeliveryCompaniesResponse>("/settings/delivery-companies", {
    params,
  });

export const getDeliveryCompanyById = (id: number) =>
  httpClient<{ success: boolean; data: DeliveryCompany }>(`/settings/delivery-companies/${id}`);

export const createDeliveryCompany = (data: CreateDeliveryCompany) =>
  httpClient<{ success: boolean; data: number }>("/settings/delivery-companies", {
    method: "POST",
    data,
  });

export const updateDeliveryCompany = (id: number, data: CreateDeliveryCompany) =>
  httpClient<{ success: boolean; data: string }>(`/settings/delivery-companies/${id}`, {
    method: "PUT",
    data,
  });

export const deleteDeliveryCompany = (id: number) =>
  httpClient<{ success: boolean; data: string }>(`/settings/delivery-companies/${id}`, {
    method: "DELETE",
  });
