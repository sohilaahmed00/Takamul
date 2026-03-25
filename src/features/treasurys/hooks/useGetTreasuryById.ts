import { useQuery } from "@tanstack/react-query";
import { treasurysKeys } from "../keys/treasurys.keys";
import { getTreasuryById } from "../services/treasurys";
import type { Treasury } from "../types/treasurys.types";

export const useGetTreasuryById = (id?: number) =>
  useQuery<Treasury>({
    queryKey: treasurysKeys.detail(id as number),
    queryFn: () => getTreasuryById(id as number),
    enabled: !!id,
  });