import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { salesKeys } from "@/features/sales/keys/sales.keys";
import { posKeys } from "@/features/pos/keys/pos.keys";
import { releaseHolding } from "../services/sales";
import { CreateSalesOrder } from "../types/sales.types";

export function useReleaseHolding() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSalesOrder["payments"][0] }) => releaseHolding({ id, data }),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: salesKeys.all });
      queryClient.invalidateQueries({ queryKey: posKeys.all });
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
