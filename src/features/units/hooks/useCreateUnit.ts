import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
};
