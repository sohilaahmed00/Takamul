import { useQuery } from "@tanstack/react-query";
import type { GetAllTaxesResponse } from "../types/suppliers.types";
import { taxesKeys } from "../keys/texes.keys";
import { getAllTaxes } from "../services/taxes";

export const useGetAllTaxes = () =>
  useQuery<GetAllTaxesResponse>({
    queryKey: taxesKeys.list(),
    queryFn: () => getAllTaxes(),
  });
