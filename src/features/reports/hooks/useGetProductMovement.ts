import { useQuery } from "@tanstack/react-query";
import { getProductMovement } from "../services/reportsService";
import { reportsKeys } from "../keys/reports.keys";
import { ProductMovementParams } from "../types/reports.types";

export const useGetProductMovement = (params: ProductMovementParams) => {
  return useQuery({
    queryKey: reportsKeys.movement(params),
    queryFn: () => getProductMovement(params),
    enabled: !!(params.productId && params.from && params.to),
  });
};
