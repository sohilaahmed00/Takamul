import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuantityAdjustment } from "../services/quantityAdjustmentsService";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";

export function useCreateQuantityAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuantityAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.stockInventories,
      });
    },
  });
}