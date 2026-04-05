import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomers } from "../services/customers";
import type { createCustomer } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: createCustomer) => createCustomers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },

    onError: (error) => handleApiError(error, notifyError),
  });
}
