import { httpClient } from "@/api/httpClient";
import type {
  CustomerTransaction,
  CreateCustomerTransactionPayload,
  UpdateCustomerTransactionPayload,
} from "../types/customerTransactions.types";

export const getAllCustomerTransactions = () =>
  httpClient<CustomerTransaction[]>("/CustomerTransaction");

export const createCustomerTransaction = (
  data: CreateCustomerTransactionPayload
) =>
  httpClient<string>("/CustomerTransaction", {
    method: "POST",
    data,
  });

export const updateCustomerTransaction = (
  data: UpdateCustomerTransactionPayload
) =>
  httpClient<string>("/CustomerTransaction", {
    method: "PUT",
    data,
  });

export const getCustomerTransactionById = (id: number) =>
  httpClient<CustomerTransaction>(`/CustomerTransaction/${id}`);

export const getCustomerPaymentsByCustomerId = (customerId: number) =>
  httpClient<CustomerTransaction[]>(
    `/CustomerTransaction/customer/${customerId}`
  );

export const getTotalCustomerPayments = (customerId: number) =>
  httpClient<number>(`/CustomerTransaction/balance/${customerId}`);

export const deleteCustomerTransaction = (id: number) =>
  httpClient<string>(`/CustomerTransaction/${id}`, {
    method: "DELETE",
  });