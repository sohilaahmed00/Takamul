import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProduct } from "../types/products.types";
import { updateProduct } from "../services/products";
import { productsKeys } from "../keys/products.keys";

type UpdateProductPayload = {
  id: number;
  data: FormData;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) => updateProduct(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ", error);
    // },
  });
}
