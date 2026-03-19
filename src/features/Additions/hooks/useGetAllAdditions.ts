import { useQuery } from "@tanstack/react-query";
import type { GetAllAdditionsResponse } from "../types/additions.types";
import { additionsKeys } from "../keys/additions.keys";
import { getAllAdditions } from "../services/additions";

export const useGetAllAdditions = () =>
  useQuery<GetAllAdditionsResponse>({
    queryKey: additionsKeys.list(),
    queryFn: () => getAllAdditions(),
  });
