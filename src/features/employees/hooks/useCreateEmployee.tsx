import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { salesKeys } from "@/features/sales/keys/sales.keys";
import { createEmployee } from "../services/employees";
import { CreateEmployee } from "../types/employees.types";
import { employeesKeys } from "../keys/employees.keys";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (data: CreateEmployee) => createEmployee(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: employeesKeys.list(),
      });
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
