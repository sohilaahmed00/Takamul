import { useQuery } from "@tanstack/react-query";
import { getCitiesByCountry } from "../services/location";
import { locationKeys } from "../keys/location.keys";

export const useGetCities = (countryId?: number | null) =>
  useQuery({
    // شيلنا علامة الـ ! واستخدمنا شرط الـ enabled
    queryKey: countryId ? locationKeys.cities(countryId) : ["cities", "empty"],
    queryFn: () => getCitiesByCountry(countryId as number),
    enabled: !!countryId, // مش هيشتغل غير لو فيه بلد مختارة
  });