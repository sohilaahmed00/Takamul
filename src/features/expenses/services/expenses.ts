import { httpClient } from "@/api/httpClient";
import type {
  Expense,
  ExpensesResponse,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../types/Expenses.types";

export const getAllExpenses = (
  params: { page?: number; pageSize?: number; searchTerm?: string } = {}
) => {
  const qs = new URLSearchParams();
  if (params.page) qs.append("Page", String(params.page));
  if (params.pageSize) qs.append("PageSize", String(params.pageSize));
  if (params.searchTerm) qs.append("SearchTerm", params.searchTerm);
  const query = qs.toString();
  return httpClient<ExpensesResponse>(`/Expenses${query ? `?${query}` : ""}`);
};

export const getExpenseById = (id: number) =>
  httpClient<Expense>(`/Expenses/${id}`);

export const createExpense = (data: CreateExpensePayload) =>
  httpClient<string>("/Expenses", { method: "POST", data });

export const updateExpense = (id: number, data: Omit<UpdateExpensePayload, "id">) =>
  httpClient<string>(`/Expenses/${id}`, { method: "PUT", data });

export const deleteExpense = (id: number) =>
  httpClient<string>(`/Expenses/${id}`, { method: "DELETE" });