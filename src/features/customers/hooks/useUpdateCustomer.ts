"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../services/customers";
import { customersKeys } from "../keys/customers.keys";
import type { createCustomer } from "../types/customers.types";

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
        queryKey: customersKeys.list({ page: 1, limit: 10, searchTerm: "" }),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ", error);
    // },
  });
}
