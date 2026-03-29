import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItem } from "../services/itemsService";
import { itemsKeys } from "../keys/items.keys";
import type { UpdateItemPayload } from "../types/items.types";

// ✅ fixed: كان بيستخدم createItem بدل updateItem
export default function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemPayload }) =>
      updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.all });
    },
  });
}