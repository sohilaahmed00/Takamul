import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { updateAddition } from "../services/additions";
import type { createAddition } from "../types/permissions.types";
import { additionsKeys } from "../keys/additions.keys";
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

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
