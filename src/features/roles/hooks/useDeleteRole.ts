import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/features/categories/services/categories";
import { categoriesKeys } from "@/features/categories/keys/categories.keys";
import { deleteRole } from "../services/roles";
import { rolesKeys } from "../keys/roles.keys";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: (roleName: string) => deleteRole(roleName),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
