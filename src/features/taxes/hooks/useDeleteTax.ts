import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTax } from "../services/taxes";
import { taxesKeys } from "../keys/taxes.keys";

export const useDeleteTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTax(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxesKeys.list() });
    },
  });
};
