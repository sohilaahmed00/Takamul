import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSupplierTransaction } from "../services/supplierTransactions";
import { supplierTransactionsKeys } from "../keys/supplierTransactions.keys";

export const useDeleteSupplierTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplierTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};