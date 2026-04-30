import { useQuery } from "@tanstack/react-query";
import { getSalesReturnReport } from "../services/reportsService";
import { SalesReturnReportParams } from "../types/reports.types";

export const useGetSalesReturnReport = (params: SalesReturnReportParams) => {
  return useQuery({
    queryKey: ["sales-return-report", params],
    queryFn: () => getSalesReturnReport(params),
  });
};
