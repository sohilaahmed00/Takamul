import CategoriesList from "@/pages/CategoriesList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "../keys/categories.keys";
import type { CreateCategory } from "@/features/sales/types/categories.types";
import { createCategory } from "../services/categories";
import useToast from "@/hooks/useToast";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: FormData) => createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.list(),
      });
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
