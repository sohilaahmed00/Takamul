import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../services/expenses";
import { expensesKeys } from "../keys/expenses.keys";
import type { UpdateExpensePayload } from "../types/Expenses.types";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateExpensePayload) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};