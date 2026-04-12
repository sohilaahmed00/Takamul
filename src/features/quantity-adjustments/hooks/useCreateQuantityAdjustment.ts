import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuantityAdjustment } from "../services/quantityAdjustmentsService";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

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
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
