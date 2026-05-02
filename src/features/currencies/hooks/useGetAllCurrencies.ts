import { useQuery } from "@tanstack/react-query";
import { getAllCurrencies } from "../services/currencies";

export const useGetAllCurrencies = (params?: { Page?: number; PageSize?: number; SearchTerm?: string }) => {
  return useQuery({
    queryKey: ["currencies", params],
    queryFn: () => getAllCurrencies(params),
  });
};
