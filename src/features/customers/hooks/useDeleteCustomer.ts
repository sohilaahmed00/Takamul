import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../services/customers";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { customersKeys } from "../keys/customers.keys";

export function useDeleteCustomer() {
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
