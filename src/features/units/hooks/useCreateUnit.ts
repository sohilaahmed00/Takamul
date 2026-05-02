import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
};
