import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import useToast from "@/hooks/useToast";
import type { CreateQuotation } from "../types/quotations.types";
import { createQuotation } from "../services/quotations";
import { handleApiError } from "@/lib/handleApiError";
import { quotationsKeys } from "../keys/quotations.keys";

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreateQuotation) => createQuotation(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: quotationsKeys.all,
      });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
