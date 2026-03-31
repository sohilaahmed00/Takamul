import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWarehouse } from "../services/warehouses";
import { warehousesKeys } from "../keys//Warehouses.keys";

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.all });
    },
  });
};