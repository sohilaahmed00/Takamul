import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRevenue } from "../services/revenues";
import { revenuesKeys } from "../keys/revenues.keys";

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: revenuesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};