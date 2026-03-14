import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomers } from "../services/customers";
import type { createCustomer } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: createCustomer) => createCustomers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ❌", error);
    // },
  });
}
