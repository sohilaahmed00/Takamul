import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { updateGiftCard } from "../services/giftCardsService";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";

export function useUpdateGiftCard() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: updateGiftCard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
