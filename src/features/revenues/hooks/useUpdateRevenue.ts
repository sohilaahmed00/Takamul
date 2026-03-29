import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRevenue } from "../services/revenues";
import { revenuesKeys } from "../keys/revenues.keys";
import type { UpdateRevenuePayload } from "../types/revenues.types";

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateRevenuePayload) =>
      updateRevenue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: revenuesKeys.all });
      queryClient.invalidateQueries({ queryKey: ["treasurys"] });
    },
  });
};