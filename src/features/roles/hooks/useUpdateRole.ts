import { useMutation, useQueryClient } from "@tanstack/react-query";

import useToast from "@/hooks/useToast";
import { UpdateRole } from "../types/roles.types";
import { updateRole } from "../services/roles";
import { rolesKeys } from "../keys/roles.keys";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: UpdateRole) => updateRole(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
