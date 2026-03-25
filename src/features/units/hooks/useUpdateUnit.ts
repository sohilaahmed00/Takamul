import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";
import type { UpdateUnitPayload } from "../types/units.types";

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUnitPayload }) => updateUnit({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
    },
  });
};
