import { useQuery } from "@tanstack/react-query";
import { getStatesByCity } from "../services/location";
import { locationKeys } from "../keys/location.keys";

export const useGetStates = (cityId?: number | null) =>
  useQuery({
    queryKey: cityId ? locationKeys.states(cityId) : ["states", "empty"],
    queryFn: () => getStatesByCity(cityId as number),
    enabled: !!cityId, // مش هيشتغل غير لو فيه مدينة مختارة
  });