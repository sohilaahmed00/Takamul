import { useQuery } from "@tanstack/react-query";
import { getUnitById } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";

export const useGetUnitById = (id?: number) => {
  return useQuery({
    queryKey: unitsKeys.detail(id as number),
    queryFn: () => getUnitById(id as number),
    enabled: !!id,
  });
};