import { useQuery } from "@tanstack/react-query";
import { getTotalSupplierPayments } from "../services/supplierTransactions";
import { supplierTransactionsKeys } from "../keys/supplierTransactions.keys";

export const useGetTotalSupplierPayments = (supplierId?: number) =>
  useQuery({
    queryKey: supplierTransactionsKeys.totalBySupplier(supplierId),
    queryFn: () => getTotalSupplierPayments(supplierId!),
    enabled: !!supplierId,
  });