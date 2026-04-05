import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../services/customers";
import { customersKeys } from "../keys/customers.keys";
import type { createCustomer } from "../types/customers.types";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

type UpdateCustomerPayload = {
  id: number;
  data: createCustomer;
};

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCustomerPayload) => updateCustomer(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
