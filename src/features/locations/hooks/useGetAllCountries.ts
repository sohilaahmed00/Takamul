import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "../services/locations";
import { locationsKeys } from "../keys/locations.keys";
import { GetAllCountriesResponse } from "../types/locations.types";

export const useGetAllCountries = () =>
  useQuery<GetAllCountriesResponse>({
    queryKey: locationsKeys.list(),
    queryFn: () => getAllCountries(),
  });
