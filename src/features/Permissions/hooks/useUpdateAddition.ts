import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { createAddition } from "@/features/Additions/types/additions.types";
import { updateAddition } from "@/features/Additions/services/additions";
import { additionsKeys } from "@/features/Additions/keys/additions.keys";

type UpdateCategoryPayload = {
  id: number;
  data: createAddition;
};

export function useUpdateAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryPayload) => updateAddition(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: additionsKeys.list(),
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
