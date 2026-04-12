import { useQuery } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getQuantityAdjustments } from "../services/quantityAdjustmentsService";

export function useGetQuantityAdjustments(params: { pageNumber: number; pageSize: number; searchTerm?: string }) {
  return useQuery({
    queryKey: quantityAdjustmentKeys.all,
    queryFn: () => getQuantityAdjustments(params),
    placeholderData: (previousData) => previousData,
  });
}
