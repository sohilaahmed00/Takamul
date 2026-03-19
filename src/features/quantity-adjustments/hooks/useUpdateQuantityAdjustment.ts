import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuantityAdjustment } from "../services/quantityAdjustmentsService";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import type { UpdateQuantityAdjustmentPayload } from "../types/adjustments.types";

export function useUpdateQuantityAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateQuantityAdjustmentPayload;
    }) => updateQuantityAdjustment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.stockInventories,
      });
    },
  });
}