import { useQuery } from "@tanstack/react-query";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { getQuantityAdjustmentById } from "../services/quantityAdjustmentsService";

export function useGetQuantityAdjustmentById(id?: number) {
  return useQuery({
    queryKey: quantityAdjustmentKeys.detail(id ?? 0),
    queryFn: () => getQuantityAdjustmentById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}