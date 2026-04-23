import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuantityAdjustment, updateQuantityAdjustment } from "../services/quantityAdjustmentsService";
import { quantityAdjustmentKeys } from "../keys/quantityAdjustmentKeys";
import type { UpdateQuantityAdjustmentPayload } from "../types/adjustments.types";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useDeleteQuantityAdjustment() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteQuantityAdjustment(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: quantityAdjustmentKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
