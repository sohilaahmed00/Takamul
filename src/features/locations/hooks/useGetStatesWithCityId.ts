import { useQuery } from "@tanstack/react-query";
import { locationsKeys } from "../keys/locations.keys";
import type { GetStatesWithCityIdResponse } from "../types/locations.types";
import { getStatesWithCityId } from "../services/locations";

export const useGetStatesWithCityId = (cityId?: number) =>
  useQuery<GetStatesWithCityIdResponse>({
    queryKey: locationsKeys.states(cityId),
    queryFn: () => {
      if (!cityId) {
        throw new Error("CityId is Required");
      }
      return getStatesWithCityId(cityId);
    },
    enabled: !!cityId,
  });
