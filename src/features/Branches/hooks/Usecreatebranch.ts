import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createBranch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: branchesKeys.all }),
  });
};