import { useQuery } from "@tanstack/react-query";
import { getAllUnits } from "../services/units";
import { unitsKeys } from "../keys/units.keys";
import type { GetAllUnitsResponse } from "../types/untis.types";

export const useGetAllUnits = () =>
  useQuery<GetAllUnitsResponse>({
    queryKey: unitsKeys.list(),
    queryFn: () => getAllUnits(),
  });
