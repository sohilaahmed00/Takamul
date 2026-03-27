import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierTransaction } from "../services/supplierTransactions";
import { supplierTransactionsKeys } from "../keys/supplierTransactions.keys";

export const useUpdateSupplierTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupplierTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierTransactionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};