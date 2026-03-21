import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../services/categories";
import { categoriesKeys } from "../keys/categories.keys";
import useToast from "@/hooks/useToast";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
const{notifyError,notifySuccess} = useToast()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({
        queryKey: categoriesKeys.all,
      });
      notifySuccess(response?.message)
    },
    onError: (error) => {
      // console.error("API ERROR ❌", error);
    },
  });
}
