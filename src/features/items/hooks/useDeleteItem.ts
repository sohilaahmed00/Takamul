import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItem } from "../services/itemsService";
import { itemsKeys } from "../keys/items.keys";

export default function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.all });
    },
  });
}