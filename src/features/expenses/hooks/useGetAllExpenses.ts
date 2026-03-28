import { useQuery } from "@tanstack/react-query";
import { getAllExpenses } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";

export const useGetAllExpenses = () => {
  return useQuery({
    queryKey: expensesKeys.all,
    queryFn: getAllExpenses,
  });
};