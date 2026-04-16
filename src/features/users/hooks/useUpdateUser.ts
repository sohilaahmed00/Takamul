import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { UpdateUser } from "../types/users.types";
import { updateUser } from "../services/users";
import { usersKeys } from "../keys/users.keys";

type UpdateUserPayload = {
  id: number;
  data: UpdateUser;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) => updateUser(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
