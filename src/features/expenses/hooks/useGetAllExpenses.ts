import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetAllExpenseResponse } from "../types/expenses.types";
import { getAllExpense } from "../services/expenses";
import { expenseKeys } from "../keys/expense.keys";

export const useGetAllExpenses = ({ page, limit }: { page: number; limit: number }) =>
  useQuery<GetAllExpenseResponse>({
    queryKey: expenseKeys.list({ page, limit }),
    queryFn: () => getAllExpense(page, limit),
    placeholderData: keepPreviousData,
  });
