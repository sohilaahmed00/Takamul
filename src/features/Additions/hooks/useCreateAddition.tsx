import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { additionsKeys } from "../keys/additions.keys";
import { createAdditions } from "../services/additions";
import type { createAddition } from "../types/additions.types";
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";

export function useCreateAddition() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: createAddition) => createAdditions(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: additionsKeys.list(),
      });
      notifySuccess(response?.message);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
