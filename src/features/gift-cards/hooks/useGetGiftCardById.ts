import { useQuery } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { getGiftCardById } from "../services/giftCardsService";

export function useGetGiftCardById(id?: number) {
  return useQuery({
    queryKey: giftCardKeys.detail(id ?? 0),
    queryFn: () => getGiftCardById(id as number),
    enabled: typeof id === "number" && id > 0,
  });
}