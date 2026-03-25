import { useQuery } from "@tanstack/react-query";
import { internalTreasuryTransfersKeys } from "../keys/internalTreasuryTransfers.keys";
import { getInternalTreasuryTransferById } from "../services/internalTreasuryTransfers";
import type { InternalTreasuryTransferApiItem } from "../types/internalTreasuryTransfers.types";

export const useGetInternalTreasuryTransferById = (id?: number) =>
  useQuery<InternalTreasuryTransferApiItem>({
    queryKey: internalTreasuryTransfersKeys.detail(id as number),
    queryFn: () => getInternalTreasuryTransferById(id as number),
    enabled: !!id,
  });