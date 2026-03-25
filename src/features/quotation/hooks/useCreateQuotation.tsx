import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSalesOrders } from "../services/sales";
import { salesKeys } from "../keys/sales.keys";
import axios from "axios";
import useToast from "@/hooks/useToast";
import type { CreateQuotation } from "../types/quotations.types";

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreateQuotation) => createSalesOrders(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      notifySuccess(response?.message);
    },
    onError: (error: any) => {
      const res = error;
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
