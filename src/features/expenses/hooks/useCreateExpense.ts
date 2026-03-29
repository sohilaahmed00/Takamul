import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};