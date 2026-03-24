import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { createGiftCard } from "../services/giftCardsService";

export function useCreateGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGiftCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
    },
  });
}