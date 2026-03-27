import { httpClient } from "@/api/httpClient";
import type {
  SupplierTransaction,
  CreateSupplierTransactionPayload,
  UpdateSupplierTransactionPayload,
} from "../types/supplierTransactions.types";

export const getAllSupplierTransactions = () =>
  httpClient<SupplierTransaction[]>("/SupplierTransaction");

export const createSupplierTransaction = (
  data: CreateSupplierTransactionPayload
) =>
  httpClient<string>("/SupplierTransaction", {
    method: "POST",
    data,
  });

export const updateSupplierTransaction = (
  data: UpdateSupplierTransactionPayload
) =>
  httpClient<string>("/SupplierTransaction", {
    method: "PUT",
    data,
  });

export const getSupplierTransactionById = (id: number) =>
  httpClient<SupplierTransaction>(`/SupplierTransaction/GetPaymentsByID/${id}`);

export const getSupplierPaymentsBySupplierId = (supplierId: number) =>
  httpClient<SupplierTransaction[]>(
    `/SupplierTransaction/supplierPayments/${supplierId}`
  );

export const getTotalSupplierPayments = (supplierId: number) =>
  httpClient<number>(`/SupplierTransaction/TotalSupplierPayments/${supplierId}`);

export const deleteSupplierTransaction = (id: number) =>
  httpClient<string>(`/SupplierTransaction/${id}`, {
    method: "DELETE",
  });