import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProduct } from "../types/products.types";
import { updateProduct, updateProductBranched, updateProductDirect, updateProductPrepared } from "../services/products";
import { productsKeys } from "../keys/products.keys";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

type UpdateProductPayload = {
  id: number;
  data: FormData;
};

export function useUpdateProductPrepared() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) => updateProductPrepared(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
