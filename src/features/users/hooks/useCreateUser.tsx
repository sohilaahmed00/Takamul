import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { createUser } from "../services/users";
import { CreateUser } from "../types/users.types";
import { usersKeys } from "../keys/users.keys";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: CreateUser) => createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
