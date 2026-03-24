import { useQuery } from "@tanstack/react-query";
import { wareHousesKeys } from "../keys/wareHouse.keys";
import type { GetAllWareHousesResponse } from "../types/wareHouse.types";
import { getAllWareHouses } from "../services/wareHouse";

export const useGetAllWareHouses = () =>
  useQuery<GetAllWareHousesResponse>({
    queryKey: wareHousesKeys.list(),
    queryFn: () => getAllWareHouses(),
  });
