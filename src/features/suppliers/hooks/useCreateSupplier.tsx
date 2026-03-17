import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "../types/suppliers.types";
import { suppliersKeys } from "../keys/suppliers.keys";
import { createSuppliers } from "../services/suppliers";

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: createSupplier) => createSuppliers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: suppliersKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ❌", error);
    // },
  });
}
