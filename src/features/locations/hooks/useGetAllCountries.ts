import { useQuery } from "@tanstack/react-query";
import type { GetAllCountriesResponse } from "../types/customers.types";
import { customersKeys } from "../keys/customers.keys";
import { getAllCountries } from "../services/locations";

export const useGetAllCountries = () =>
  useQuery<GetAllCountriesResponse>({
    queryKey: customersKeys.list(),
    queryFn: () => getAllCountries(),
  });
