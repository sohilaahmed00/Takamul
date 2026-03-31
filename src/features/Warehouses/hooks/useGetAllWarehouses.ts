import { useQuery } from "@tanstack/react-query";
import { warehousesKeys } from "../keys/Warehouses.keys";
import { getAllWarehouses } from "../services/warehouses";

export const useGetAllWarehouses = () =>
  useQuery({
    queryKey: warehousesKeys.lists(),
    queryFn: getAllWarehouses,
  });