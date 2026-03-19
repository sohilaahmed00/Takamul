import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsKeys } from "../keys/products.keys";
import { createProductsPrepared, createProductsRawMatrial } from "../services/products";
import useToast from "@/hooks/useToast";

export function useCreateProductRawMaterial() {
  const queryClient = useQueryClient();
  const { notifyError, notifyWarning, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: FormData) => createProductsRawMatrial(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: productsKeys.list(),
      });
      notifySuccess(response);
    },
    onError: (error: any) => {
      const res = error?.response?.data;
      console.log(res);
      if (res?.errors) {
        Object.values(res.errors)
          .flat()
          .forEach((message) => {
            notifyError(String(message));
          });
      } else if (res) {
        notifyError(res);
      } else {
        notifyError("حدث خطأ غير متوقع");
      }
    },
  });
}
