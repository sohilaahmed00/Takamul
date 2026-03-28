import { httpClient } from "@/api/httpClient";
import type {
  Expense,
  ExpensesListResponse,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../types/expenses.types";

export const getAllExpenses = async () => {
  const response = await httpClient<ExpensesListResponse | Expense[]>("/Expenses");

  if (Array.isArray(response)) return response;
  return response.items ?? [];
};

export const getExpenseById = (id: number) =>
  httpClient<Expense>(`/Expenses/${id}`);

export const createExpense = (data: CreateExpensePayload) =>
  httpClient<string>("/Expenses", {
    method: "POST",
    data,
  });

export const updateExpense = (id: number, data: Omit<UpdateExpensePayload, "id">) =>
  httpClient<string>(`/Expenses/${id}`, {
    method: "PUT",
    data,
  });

export const deleteExpense = (id: number) =>
  httpClient<string>(`/Expenses/${id}`, {
    method: "DELETE",
  });