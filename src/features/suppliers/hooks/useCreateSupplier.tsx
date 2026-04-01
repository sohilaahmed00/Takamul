import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "../types/suppliers.types";
import { suppliersKeys } from "../keys/suppliers.keys";
import { createSuppliers } from "../services/suppliers";
import { handleApiError } from "@/lib/handleApiError";
import useToast from "@/hooks/useToast";

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: createSupplier) => createSuppliers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: suppliersKeys.list(),
      });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
