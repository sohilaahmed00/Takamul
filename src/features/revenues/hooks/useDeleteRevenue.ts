import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRevenue } from "../services/revenues";
import { revenuesKeys } from "../keys/revenues.keys";

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: revenuesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};