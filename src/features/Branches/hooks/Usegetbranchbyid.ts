import { useQuery } from "@tanstack/react-query";
import { getBranchById } from "../services/Branches";
import { branchesKeys } from "../keys/Branches.keys";
import { Branch } from "../types/Branches.types";
export const useGetBranchById = (id?: number) => useQuery<Branch>({ queryKey: branchesKeys.detail(id), queryFn: () => getBranchById(id), enabled: !!id });
