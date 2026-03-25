import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { createProductDirect } from "../services/products";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export function useCreateProductDirect() {
  const queryClient = useQueryClient();
  const { notifyError, notifyWarning, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: FormData) => createProductDirect(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
      notifySuccess(response);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
