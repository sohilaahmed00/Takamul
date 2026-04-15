import { useQuery } from "@tanstack/react-query";
import { getProfitReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { ProfitReportParams } from "../types/reports.types";

export const useGetProfitReport = (params: ProfitReportParams) => {
  return useQuery({
    queryKey: reportsKeys.profit(params),
    queryFn: () => getProfitReport(params),
  });
};
