import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBranch } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteBranch, onSuccess: () => queryClient.invalidateQueries({ queryKey: branchesKeys.all }) });
};