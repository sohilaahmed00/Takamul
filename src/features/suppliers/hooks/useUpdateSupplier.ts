"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { createSupplier } from "../types/suppliers.types";
import { updateSupplier } from "../services/suppliers";
import { suppliersKeys } from "../keys/suppliers.keys";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

type UpdateSupplierPayload = {
  id: number;
  data: createSupplier;
};

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateSupplierPayload) => updateSupplier(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: suppliersKeys.list(),
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => {
      handleApiError(error, notifyError);
    },
  });
}
