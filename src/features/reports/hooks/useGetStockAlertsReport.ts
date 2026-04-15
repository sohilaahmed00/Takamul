import { useQuery } from "@tanstack/react-query";
import { getStockAlertReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { StockAlertReportParams } from "../types/reports.types";

export const useGetStockAlertsReport = (params: StockAlertReportParams) => {
  return useQuery({
    queryKey: reportsKeys.stockAlerts(params),
    queryFn: () => getStockAlertReport(params),
  });
};
