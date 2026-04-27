import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { upgradeToPcsid } from "../services/zatcha";
import { UpgradeToPcsidRequest } from "../types/zarcha.types";

export function useUpgradeToPcsid() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: UpgradeToPcsidRequest) => upgradeToPcsid(data),
    onSuccess: (response) => {
      console.log(response);
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
