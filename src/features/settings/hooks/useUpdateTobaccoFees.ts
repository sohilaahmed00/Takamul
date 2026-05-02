import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTobaccoFees } from "../services/settings";
import { settingsKeys } from "../keys/settings.keys";

export const useUpdateTobaccoFees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { tobaccoFees: number }) => updateTobaccoFees(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
};
