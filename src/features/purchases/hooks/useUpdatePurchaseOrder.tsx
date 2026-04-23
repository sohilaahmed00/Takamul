import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import type { CreatePurchaseOrder } from "../types/purchase.types";
import { createPurchaseOrder, updatePurchaseOrder } from "../services/purchases";
import { purchasesKeys } from "../keys/purchases.keys";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: ({ data, id }: { data: CreatePurchaseOrder; id: number }) => updatePurchaseOrder({ id, data }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: purchasesKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
