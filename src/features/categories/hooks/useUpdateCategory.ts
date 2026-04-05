import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "../keys/categories.keys";
import { updateCategory } from "../services/categories";
import useToast from "@/hooks/useToast";
import { handleApiError } from "@/lib/handleApiError";
import { handleApiSuccess } from "@/lib/handleApiSuccess";

type UpdateCategoryPayload = {
  id: number;
  data: FormData;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { notifyError, notifySuccess } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCategoryPayload) => updateCategory(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.list(),
      });
      handleApiSuccess(response, notifySuccess);
    },
    onError: (error) => handleApiError(error, notifyError),
  });
}
