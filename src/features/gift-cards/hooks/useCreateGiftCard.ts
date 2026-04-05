import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { createGiftCard } from "../services/giftCardsService";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useCreateGiftCard() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: createGiftCard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
