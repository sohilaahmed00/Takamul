import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTax } from "../services/taxes";
import { taxesKeys } from "../keys/taxes.keys";
import { CreateTax } from "../types/taxes.types";

export const useAddTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTax) => createTax(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxesKeys.list() });
    },
  });
};
