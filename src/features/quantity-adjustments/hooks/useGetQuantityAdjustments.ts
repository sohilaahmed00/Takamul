import { useQuery } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getQuantityAdjustments } from "../services/quantityAdjustmentsService";

export function useGetQuantityAdjustments(params: { pageNumber: number; pageSize: number }) {
  return useQuery({
    queryKey: quantityAdjustmentKeys.lists(params.pageNumber, params.pageSize),
    queryFn: () => getQuantityAdjustments(params),
    placeholderData: (previousData) => previousData,
  });
}
