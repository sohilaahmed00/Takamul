import { useQuery } from "@tanstack/react-query";
import { getAllCountries, getCitiesWithCountryId } from "../services/locations";
import { locationsKeys } from "../keys/locations.keys";
import { GetCitiesWithCountryIdResponse } from "../types/locations.types";

export const useGetCityWithCountryId = (countryId: number) =>
  useQuery<GetCitiesWithCountryIdResponse>({
    queryKey: locationsKeys.cities(countryId),
    queryFn: () => getCitiesWithCountryId(countryId),
    enabled: !!countryId,
  });
