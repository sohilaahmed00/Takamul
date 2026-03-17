"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "../types/suppliers.types";
import { updateSupplier } from "../services/suppliers";
import { suppliersKeys } from "../keys/suppliers.keys";

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
