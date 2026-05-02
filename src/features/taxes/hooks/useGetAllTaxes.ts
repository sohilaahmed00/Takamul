import { useQuery } from "@tanstack/react-query";
import type { GetAllTaxesResponse } from "../types/taxes.types";
import { taxesKeys } from "../keys/taxes.keys";
import { getAllTaxes } from "../services/taxes";

export const useGetAllTaxes = () =>
  useQuery<GetAllTaxesResponse>({
    queryKey: taxesKeys.list(),
    queryFn: () => getAllTaxes(),
  });
