import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomerTransaction } from "../services/customerTransactions";
import { customerTransactionsKeys } from "../keys/customerTransactions.keys";

export const useCreateCustomerTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};