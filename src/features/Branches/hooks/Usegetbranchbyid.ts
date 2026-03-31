import { useQuery } from "@tanstack/react-query";
import { getBranchById } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";
export const useGetBranchById = (id?: number) =>
  useQuery({ queryKey: branchesKeys.detail(id!), queryFn: () => getBranchById(id!), enabled: !!id });