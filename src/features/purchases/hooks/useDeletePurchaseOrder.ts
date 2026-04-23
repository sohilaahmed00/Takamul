import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { deletePurchaseOrder } from "../services/purchases";
import { purchasesKeys } from "../keys/purchases.keys";

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deletePurchaseOrder(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: purchasesKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
