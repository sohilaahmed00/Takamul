"use client";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../types/customers.types";
import { updateCustomer } from "../services/customers";
import { customersKeys } from "../keys/customers.keys";

type UpdateCustomerPayload = {
  id: number;
  data: createCustomer;
};

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCustomerPayload) => updateCustomer(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ", error);
    // },
  });
}
