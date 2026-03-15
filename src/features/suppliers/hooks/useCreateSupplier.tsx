import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersKeys } from "../keys/customers.keys";
import { createSuppliers } from "../services/customers";
import type { createSupplier } from "../types/suppliers.types";

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: createSupplier) => createSuppliers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: customersKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ❌", error);
    // },
  });
}
