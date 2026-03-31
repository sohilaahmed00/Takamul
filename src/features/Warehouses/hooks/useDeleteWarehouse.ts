import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWarehouse } from "../services/warehouses";
import { warehousesKeys } from "../keys/Warehouses.keys";

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehousesKeys.all });
    },
  });
};