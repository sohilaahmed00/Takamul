import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { createProductsPrepared, createProductsRawMatrial } from "../services/products";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useCreateProductRawMaterial() {
  const queryClient = useQueryClient();
  const { notifyError, notifyWarning, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createProductsRawMatrial(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
