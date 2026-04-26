import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useToast from "@/hooks/useToast";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { handleApiError } from "@/lib/handleApiError";
import { additionsKeys } from "@/features/Additions/keys/additions.keys";
import { deleteAddition } from "@/features/Additions/services/additions";

export function useDeleteAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteAddition(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: additionsKeys.list(),
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
