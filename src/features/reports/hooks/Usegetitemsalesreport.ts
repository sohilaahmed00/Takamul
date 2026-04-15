import { useQuery } from "@tanstack/react-query";
import { getItemSalesReport } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { ItemSalesReportParams } from "../types/reports.types";

export const useGetItemSalesReport = (params: ItemSalesReportParams) => {
  return useQuery({
    queryKey: reportsKeys.itemSales(params),
    queryFn: () => getItemSalesReport(params),
    enabled: !!params.productCode,
  });
};
