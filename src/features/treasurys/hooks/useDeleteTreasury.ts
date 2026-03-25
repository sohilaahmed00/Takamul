import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTreasury } from "../services/treasurys";
import { treasurysKeys } from "../keys/treasurys.keys";

export function useDeleteTreasury() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTreasury(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: treasurysKeys.list(),
      });
    },
  });
}