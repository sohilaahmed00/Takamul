import { useQuery } from "@tanstack/react-query";
import { getTotalCustomerPayments } from "../services/customerTransactions";
import { customerTransactionsKeys } from "../keys/customerTransactions.keys";


export const useGetTotalCustomerPayments = (customerId?: number) =>
  useQuery({
    queryKey: customerTransactionsKeys.totalByCustomer(customerId),
    queryFn: () => getTotalCustomerPayments(customerId!),
    enabled: !!customerId,
  });