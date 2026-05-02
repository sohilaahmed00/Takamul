import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTax } from "../services/taxes";
import { taxesKeys } from "../keys/taxes.keys";
import { CreateTax } from "../types/taxes.types";

export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateTax }) => updateTax(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taxesKeys.list() });
      queryClient.invalidateQueries({ queryKey: taxesKeys.detail(variables.id) });
    },
  });
};
