import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTreasury } from "../services/treasurys";
import { treasurysKeys } from "../keys/treasurys.keys";
import type { UpdateTreasuryPayload } from "../types/treasurys.types";

export function useUpdateTreasury() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTreasuryPayload) => updateTreasury(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: treasurysKeys.list(),
      });
    },
  });
}