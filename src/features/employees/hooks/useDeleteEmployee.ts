import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEmployee } from "../services/employees";
import useToast from "@/hooks/useToast";
import { employeesKeys } from "../keys/employees.keys";
import { handleApiSuccess } from "@/lib/handleApiSuccess";
import { handleApiError } from "@/lib/handleApiError";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: employeesKeys.list(),
      });
      handleApiSuccess(response?.message, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
