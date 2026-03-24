import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSalesOrders } from "../services/sales";
import type { CreateSalesOrder } from "../types/sales.types";
import { salesKeys } from "../keys/sales.keys";
import axios from "axios";
import useToast from "@/hooks/useToast";

export function useCreateSalesOrders() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreateSalesOrder) => createSalesOrders(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
      notifySuccess(response?.message)
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
