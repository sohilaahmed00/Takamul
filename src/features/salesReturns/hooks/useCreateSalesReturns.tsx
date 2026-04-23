import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { CreateSalesReturns } from "../types/salesReturns.types";
import { salesReturnsKeys } from "../keys/salesReturns.keys";
import { createSalesReturn } from "../services/salesReturns";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useCreateSalesReturns() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreateSalesReturns) => createSalesReturn(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: salesReturnsKeys.all,
      });
      handleApiSuccess(response,notifySuccess)
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
