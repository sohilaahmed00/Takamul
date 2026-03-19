import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "../keys/categories.keys";
import { updateCategory } from "../services/categories";
import useToast from "@/hooks/useToast";

type UpdateCategoryPayload = {
  id: number;
  data: FormData;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryPayload) => updateCategory(id, data),
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
