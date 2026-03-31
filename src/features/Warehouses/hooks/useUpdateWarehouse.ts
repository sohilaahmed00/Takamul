import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWarehouse } from "../services/warehouses";
import { warehousesKeys } from "../keys/Warehouses.keys";
import type { UpdateWarehousePayload } from "../types/Warehouses.types";


export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // التعديل هنا: نمرر الـ payload مباشرة للدالة
    mutationFn: (payload: UpdateWarehousePayload) => updateWarehouse(payload),
    onSuccess: () => {
      // عمل تحديث للبيانات في الكاش بعد النجاح
      queryClient.invalidateQueries({ queryKey: warehousesKeys.all });
    },
  });
};