import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "@/features/customers/services/customers";
import { deleteSupplier } from "../services/suppliers";
import { suppliersKeys } from "../keys/suppliers.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: suppliersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
