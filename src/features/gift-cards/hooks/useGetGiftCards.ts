import { useQuery } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { getGiftCards } from "../services/giftCardsService";

export function useGetGiftCards() {
  return useQuery({
    queryKey: giftCardKeys.lists(),
    queryFn: getGiftCards,
    placeholderData: (prev) => prev,
  });
}