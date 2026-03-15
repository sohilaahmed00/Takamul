import { useQuery } from "@tanstack/react-query";
import { locationsKeys } from "../keys/locations.keys";
import type { GetCitiesWithCountryIdResponse } from "../types/locations.types";
import { getCitiesWithCountryId } from "../services/locations";

export const useGetCityWithCountryId = (countryId: number) =>
  useQuery<GetCitiesWithCountryIdResponse>({
    queryKey: locationsKeys.cities(countryId),
    queryFn: () => getCitiesWithCountryId(countryId),
    enabled: !!countryId,
  });
