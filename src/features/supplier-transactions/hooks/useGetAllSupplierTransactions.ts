import { useQuery } from "@tanstack/react-query";
import { getAllSupplierTransactions } from "../services/supplierTransactions";
import { supplierTransactionsKeys } from "../keys/supplierTransactions.keys";

export const useGetAllSupplierTransactions = () => {
  return useQuery({
    queryKey: supplierTransactionsKeys.all,
    queryFn: getAllSupplierTransactions,
  });
};