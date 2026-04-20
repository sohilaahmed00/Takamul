import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/features/categories/services/categories";
import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import useToast from "@/hooks/useToast";
import { deleteQuotation } from "../services/quotations";
import { quotationsKeys } from "../keys/quotations.keys";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useDeleteQuotation() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteQuotation(id),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: quotationsKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => {
      handleApiError(error, notifyError);
    },
  });
}
