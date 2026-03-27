import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerTransaction } from "../services/customerTransactions";
import { customerTransactionsKeys } from "../keys/customerTransactions.keys";

export const useUpdateCustomerTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};