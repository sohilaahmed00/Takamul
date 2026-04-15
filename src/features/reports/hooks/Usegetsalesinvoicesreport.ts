import { useQuery } from "@tanstack/react-query";
import { getSalesInvoicesReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { SalesInvoiceReportParams } from "../types/reports.types";

export const useGetSalesInvoicesReport = (params: SalesInvoiceReportParams) => {
  return useQuery({
    queryKey: reportsKeys.salesInvoices(params),
    queryFn: () => getSalesInvoicesReport(params),
    enabled: !!(params.From && params.To),
  });
};
