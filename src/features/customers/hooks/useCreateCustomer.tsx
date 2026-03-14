
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  createCustomers } from "../services/customers";
import type { createCustomer } from "../types/customers.types";

export function useCreateCustomer() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: createCustomer) => createCustomers(data),
    // onSuccess: (response) => {
    //   console.log(response);
    //   queryClient.invalidateQueries({
    //     queryKey: customersKeys.all,
    //   });
    // },
    // onError: (error) => {
    //   console.error("API ERROR ❌", error);
    // },
  });
}
