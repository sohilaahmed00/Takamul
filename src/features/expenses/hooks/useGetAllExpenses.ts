<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import { getAllExpenses } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";
import type { GetExpensesParams } from "../types/Expenses.types";

export const useGetAllExpenses = (params: GetExpensesParams = {}) =>
  useQuery({
    queryKey: expensesKeys.list(params),
    queryFn: () => getAllExpenses(params),
  });
=======
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
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
