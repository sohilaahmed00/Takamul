import { useQuery } from "@tanstack/react-query";
import { getPurchaseInvoicesReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { PurchaseInvoiceReportParams } from "../types/reports.types";

export const useGetPurchaseInvoicesReport = (params: PurchaseInvoiceReportParams) => {
  return useQuery({
    queryKey: reportsKeys.purchaseInvoices(params),
    queryFn: () => getPurchaseInvoicesReport(params),
  });
};
