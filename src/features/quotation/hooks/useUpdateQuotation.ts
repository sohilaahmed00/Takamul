import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/features/categories/services/categories";
import type { CreateCategory } from "@/features/categories/types/categories.types";
import { quotationsKeys } from "../keys/quotations.keys";
import { CreateQuotation } from "../types/quotations.types";
import { updateQuotation } from "../services/quotations";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { handleApiError } from "@/lib/handleApiError";

type UpdateQuotationPayload = {
  id: number;
  data: CreateQuotation;
};

export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: UpdateQuotationPayload) => updateQuotation(id, data),
    onSuccess: (response) => {
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
