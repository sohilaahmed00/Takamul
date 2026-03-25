import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTreasury } from "../services/treasurys";
import { treasurysKeys } from "../keys/treasurys.keys";
import type { CreateTreasuryPayload } from "../types/treasurys.types";

export function useCreateTreasury() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreasuryPayload) => createTreasury(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: treasurysKeys.list(),
      });
    },
  });
}