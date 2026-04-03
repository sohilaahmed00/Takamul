import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProduct } from "../types/products.types";
import { updateProduct, updateProductBranched, updateProductDirect } from "../services/products";
import { productsKeys } from "../keys/products.keys";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";

type UpdateProductPayload = {
  id: number;
  data: FormData;
};

export function useUpdateProductDirect() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) => updateProductDirect(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.all,
      });
      notifySuccess(response);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
