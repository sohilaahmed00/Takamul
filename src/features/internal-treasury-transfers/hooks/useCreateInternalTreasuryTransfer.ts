import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInternalTreasuryTransfer } from "../services/internalTreasuryTransfers";
import { internalTreasuryTransfersKeys } from "../keys/internalTreasuryTransfers.keys";
import type { CreateInternalTreasuryTransferPayload } from "../types/internalTreasuryTransfers.types";

export function useCreateInternalTreasuryTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInternalTreasuryTransferPayload) =>
      createInternalTreasuryTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: internalTreasuryTransfersKeys.list(),
      });
    },
  });
}