import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import type { CreatePurchaseOrder } from "../types/purchase.types";
import { createPurchaseOrder } from "../services/purchases";
import { purchasesKeys } from "../keys/purchases.keys";

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreatePurchaseOrder) => createPurchaseOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: purchasesKeys.all,
      });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
