import { useQuery } from "@tanstack/react-query";
import { getAllCustomerTransactions } from "../services/customerTransactions";
import { customerTransactionsKeys } from "../keys/customerTransactions.keys";

export const useGetAllCustomerTransactions = () =>
  useQuery({
    queryKey: customerTransactionsKeys.all,
    queryFn: getAllCustomerTransactions,
  });