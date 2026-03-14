import { useQuery } from "@tanstack/react-query";
import { getAllCountries, getCitiesWithCountryId, getStatesWithCityId } from "../services/locations";
import { locationsKeys } from "../keys/locations.keys";
import { GetStatesWithCityIdResponse } from "../types/locations.types";

export const useGetStatesWithCityId = (cityId: number) =>
  useQuery<GetStatesWithCityIdResponse>({
    queryKey: locationsKeys.states(cityId),
    queryFn: () => getStatesWithCityId(cityId),
    enabled: !!cityId,
  });
