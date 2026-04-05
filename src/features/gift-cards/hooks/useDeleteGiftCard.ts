import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giftCardKeys } from "../keys/giftCardKeys";
import { deleteGiftCard } from "../services/giftCardsService";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useDeleteGiftCard() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: deleteGiftCard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
