import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { deleteGiftCard } from "../services/giftCardsService";

export function useDeleteGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGiftCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
    },
  });
}