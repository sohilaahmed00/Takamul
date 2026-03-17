import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
    },
  });
};