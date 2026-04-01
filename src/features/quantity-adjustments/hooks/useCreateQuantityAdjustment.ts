import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuantityAdjustment } from "../services/quantityAdjustmentsService";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";

export function useCreateQuantityAdjustment() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: createQuantityAdjustment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.stockInventories,
      });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
