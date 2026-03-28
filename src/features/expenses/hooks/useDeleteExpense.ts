import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};