import { useQuery } from "@tanstack/react-query";
import { internalTreasuryTransfersKeys } from "../keys/internalTreasuryTransfers.keys";
import { getAllInternalTreasuryTransfers } from "../services/internalTreasuryTransfers";
import type { GetAllInternalTreasuryTransfersResponse } from "../types/internalTreasuryTransfers.types";

export const useGetAllInternalTreasuryTransfers = () =>
  useQuery<GetAllInternalTreasuryTransfersResponse>({
    queryKey: internalTreasuryTransfersKeys.list(),
    queryFn: () => getAllInternalTreasuryTransfers(),
  });