import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBranch } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => updateBranch(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: branchesKeys.all }),
  });
};