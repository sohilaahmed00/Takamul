import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../services/location";
import { locationKeys } from "../keys/location.keys";



export const useGetCountries = () =>
  useQuery({ queryKey: locationKeys.countries, queryFn: getCountries });