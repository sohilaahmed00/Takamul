import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
