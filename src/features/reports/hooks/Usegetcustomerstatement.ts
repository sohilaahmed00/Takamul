import { useQuery } from "@tanstack/react-query";
import { getCustomerStatement } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { CustomerStatementParams } from "../types/reports.types";

export const useGetCustomerStatement = (params: CustomerStatementParams) => {
  return useQuery({
    queryKey: reportsKeys.customerStatement(params),
    queryFn: () => getCustomerStatement(params),
    enabled: !!(params.customerId && params.from && params.to),
    select: (data) => data.items ?? [],
  });
};