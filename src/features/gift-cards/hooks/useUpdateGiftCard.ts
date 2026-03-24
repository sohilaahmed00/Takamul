import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { updateGiftCard } from "../services/giftCardsService";

export function useUpdateGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGiftCard,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
      queryClient.invalidateQueries({ queryKey: giftCardKeys.detail(variables.id) });
    },
  });
}