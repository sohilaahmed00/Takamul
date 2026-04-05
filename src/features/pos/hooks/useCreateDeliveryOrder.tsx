import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesKeys } from "../keys/sales.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { createDeliveryOrder } from "../services/pos";
import { CreateDeliveryOrder } from "../types/pos.types";

export function useCreateDeliveryOrder() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: CreateDeliveryOrder) => createDeliveryOrder(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
