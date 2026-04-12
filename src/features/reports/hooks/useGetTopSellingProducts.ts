import { useQuery } from "@tanstack/react-query";
import { getTopSellingProducts } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { TopSellingParams } from "../types/reports.types";

export const useGetTopSellingProducts = (params: TopSellingParams) => {
  return useQuery({
    queryKey: reportsKeys.topSelling(params),
    queryFn: () => getTopSellingProducts(params),
    enabled: !!(params.from && params.to),
  });
};
