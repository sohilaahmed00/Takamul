import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { getGiftCards } from "../services/giftCardsService";
import { getAllGiftCardsResponse } from "../types/giftCard.types";
import { handleEmptyResponse } from "@/lib/handleEmptyResponse";

export function useGetGiftCards(params: { limit: number; page: number; SearchTerm?: string } = { page: 1, limit: 10 }) {
  return useQuery<getAllGiftCardsResponse>({
    queryKey: giftCardKeys.lists(params),
    queryFn: async () => {
      try {
        return await getGiftCards(params);
      } catch (err) {
        return handleEmptyResponse(err, params);
      }
    },
    placeholderData: keepPreviousData,
  });
}
