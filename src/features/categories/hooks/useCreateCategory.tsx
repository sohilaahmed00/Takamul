import CategoriesList from "@/pages/CategoriesList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "../keys/categories.keys";
import { createCategory } from "../services/categories";
import useToast from "@/hooks/useToast";
import axios from "axios";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: FormData) => createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.all,
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
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
      }
    },
  });
}
