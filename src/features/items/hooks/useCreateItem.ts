import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem } from "../services/itemsService";
import { itemsKeys } from "../keys/items.keys";

export default function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.all });
    },
  });
}