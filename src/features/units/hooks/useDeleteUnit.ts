import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
    },
  });
};