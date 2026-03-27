import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerTransaction } from "../services/customerTransactions";
import { customerTransactionsKeys } from "../keys/customerTransactions.keys";

export const useDeleteCustomerTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};