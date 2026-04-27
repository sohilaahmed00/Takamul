import { httpClient } from "@/api/httpClient";
import { GetAllTablesResponse } from "@/features/tables/types/tables.types";
import { GenerateCSR, GenerateCSRData, GenerateCSRResponse, RegisterCCSIDRequest, UpgradePcsidResponse, UpgradeToPcsidRequest } from "../types/zarcha.types";

// ===================
// GET
// ===================

export const generateCSR = (data: GenerateCSR) =>
  httpClient<GenerateCSRResponse>(`/zatca-integration/generate-csr`, {
    method: "POST",
    data,
  });
export const registerCCSID = (data: RegisterCCSIDRequest) =>
  httpClient<GenerateCSRResponse>(`/zatca-integration/register-ccsid`, {
    method: "POST",
    data,
  });
export const upgradeToPcsid = (data: UpgradeToPcsidRequest) =>
  httpClient<UpgradePcsidResponse>(`/zatca-integration/upgrade-to-pcsid`, {
    method: "POST",
    data,
  });

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// // ===================

// export const updateCategory = (id: number, data: CreateCategory) =>
//   httpClient<CreateResponse>(`/blog/category/${id}`, {
//     method: "PUT",
//     data,
//   });

// export const deleteCategory = (id: number) =>
//   httpClient<void>(`/blog/category/${id}`, {
//     method: "DELETE",
//   });

// export function getSalesOrderById(id: number) {
//   return httpClient<SalesOrder>(`/sales-orders/${id}`);
// }
