"use client";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "@/features/suppliers/types/suppliers.types";
import { updateSupplier } from "@/features/suppliers/services/suppliers";
import { suppliersKeys } from "@/features/suppliers/keys/suppliers.keys";

type UpdateSupplierPayload = {
  id: number;
  data: createSupplier;
};

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateSupplierPayload) => updateSupplier(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: suppliersKeys.list(),
      });
    },
    // onError: (error) => {
    //   console.error("API ERROR ", error);
    // },
  });
}
