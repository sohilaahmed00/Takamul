import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
    },
  });
};