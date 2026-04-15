import { useQuery } from "@tanstack/react-query";
import { getExpensesReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { ExpensesReportParams } from "../types/reports.types";

export const useGetExpensesReport = (params: ExpensesReportParams) => {
  return useQuery({
    queryKey: reportsKeys.expenses(params),
    queryFn: () => getExpensesReport(params),
    enabled: true, // Allow fetching even with empty params if needed, or customize
  });
};
