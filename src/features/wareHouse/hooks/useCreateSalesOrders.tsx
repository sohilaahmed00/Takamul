import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSalesOrders } from "../services/sales";
import type { CreateSalesOrder } from "../types/sales.types";
import { salesKeys } from "../keys/sales.keys";

export function useCreateSalesOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalesOrder) => createSalesOrders(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: salesKeys.all,
      });
    },
    onError: (error) => {
      console.error("API ERROR ❌", error);
    },
  });
}
