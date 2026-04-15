import { useQuery } from "@tanstack/react-query";
import { getProductPurchases } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { ProductPurchasesParams } from "../types/reports.types";

export const useGetProductPurchases = (params: ProductPurchasesParams) => {
  return useQuery({
    queryKey: reportsKeys.itemPurchases(params),
    queryFn: () => getProductPurchases(params),
    enabled: !!params.productID,
  });
};
