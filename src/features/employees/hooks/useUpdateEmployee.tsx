import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { salesKeys } from "@/features/sales/keys/sales.keys";
import { createEmployee, updateEmployee } from "../services/employees";
import { CreateEmployee } from "../types/employees.types";
import { employeesKeys } from "../keys/employees.keys";

export function useEditEmployee() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ data, id }: { data: CreateEmployee; id: number }) => updateEmployee({ data: data, id }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: employeesKeys.list(),
      });
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
