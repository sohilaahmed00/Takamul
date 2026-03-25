import { useQuery } from "@tanstack/react-query";
import { treasurysKeys } from "../keys/treasurys.keys";
import { getAllTreasurys } from "../services/treasurys";
import type { GetAllTreasurysResponse } from "../types/treasurys.types";

export const useGetAllTreasurys = () =>
  useQuery<GetAllTreasurysResponse>({
    queryKey: treasurysKeys.list(),
    queryFn: () => getAllTreasurys(),
  });
  