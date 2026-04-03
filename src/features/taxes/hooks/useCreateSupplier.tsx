import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "@/features/suppliers/types/suppliers.types";
import { suppliersKeys } from "@/features/suppliers/keys/suppliers.keys";
import { createSuppliers } from "@/features/suppliers/services/suppliers";

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
