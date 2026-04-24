import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "../services/auth";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import useToast from "@/hooks/useToast";
import { LoginPayload } from "../types/auth.types";
import { handleApiError } from "@/lib/handleApiError";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";

export const useLogout = () => {
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: string) => logout(data),
    onSuccess: (response) => {
      handleApiSuccess(response, notifySuccess);
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      window.location.href = "/";
    },
    onError: (error) => handleApiError(error, notifyError),
  });
};
