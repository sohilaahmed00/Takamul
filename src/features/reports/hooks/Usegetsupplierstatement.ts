import { useQuery } from "@tanstack/react-query";
import { getSupplierStatement } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { SupplierStatementParams } from "../types/reports.types";

export const useGetSupplierStatement = (params: SupplierStatementParams) => {
  return useQuery({
    queryKey: reportsKeys.supplierStatement(params),
    queryFn: () => getSupplierStatement(params),
    enabled: !!(params.supplierId && params.from && params.to),
    select: (data) => data.items ?? [],
  });
};