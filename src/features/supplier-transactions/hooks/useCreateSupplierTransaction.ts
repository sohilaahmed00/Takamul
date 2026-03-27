import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierTransaction } from "../services/supplierTransactions";
import { supplierTransactionsKeys } from "../keys/supplierTransactions.keys";

export const useCreateSupplierTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplierTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};