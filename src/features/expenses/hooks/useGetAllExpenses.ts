import { useQuery } from "@tanstack/react-query";
import { getAllExpenses } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";
import type { GetExpensesParams } from "../types/Expenses.types";

export const useGetAllExpenses = (params: GetExpensesParams = {}) =>
  useQuery({
    queryKey: expensesKeys.list(params),
    queryFn: () => getAllExpenses(params),
  });