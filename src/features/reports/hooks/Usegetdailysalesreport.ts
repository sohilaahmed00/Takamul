import { useQuery } from "@tanstack/react-query";
import { getDailySalesReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { DailySalesReportParams } from "../types/reports.types";

export const useGetDailySalesReport = (params: DailySalesReportParams) => {
  return useQuery({
    queryKey: reportsKeys.dailySales(params),
    queryFn: () => getDailySalesReport(params),
    enabled: !!(params.From && params.To),
  });
};
