import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import useToast from "@/hooks/useToast";
import { CreateRole } from "../types/roles.types";
import { createRole } from "../services/roles";
import { rolesKeys } from "../keys/roles.keys";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  const { notifyError, notifySuccess } = useToast();

  return useMutation({
    mutationFn: (data: CreateRole) => createRole(data),
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
