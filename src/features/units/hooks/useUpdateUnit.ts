import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";
import type { UpdateUnitPayload } from "../types/units.types";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUnitPayload }) => updateUnit({ id, data }),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
};
