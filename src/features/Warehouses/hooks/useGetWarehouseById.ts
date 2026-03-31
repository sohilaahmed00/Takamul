import { useQuery } from "@tanstack/react-query";
import { getWarehouseById } from "../services/warehouses";
import { warehousesKeys } from "../keys/Warehouses.keys";

export const useGetWarehouseById = (id?: number) => {
  return useQuery({
    queryKey: warehousesKeys.detail(id!),
    queryFn: () => getWarehouseById(id!),
    enabled: !!id, // الاستعلام مش هيشتغل غير لو فيه ID فعلاً
  });
};