import { useQuery } from "@tanstack/react-query";
import { getAllBranches } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";
export const useGetAllBranches = () =>
  useQuery({ queryKey: branchesKeys.all, queryFn: getAllBranches });