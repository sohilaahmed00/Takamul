import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { createProductBranched } from "../services/products";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export function useCreateProductBranched() {
  const queryClient = useQueryClient();
  const { notifyError, notifyWarning, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: FormData) => createProductBranched(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
