import { useQuery } from "@tanstack/react-query";
import { getAllUnits } from "../services/units.service";
import { unitsKeys } from "../keys/units.keys";

interface UseGetAllUnitsParams {
  page?: number;
  size?: number;
  search?: string;
}

export const useGetAllUnits = ({
  page = 1,
  size = 10,
  search = "",
}: UseGetAllUnitsParams) => {
  return useQuery({
    queryKey: unitsKeys.list({ page, size, search }),
    queryFn: () => getAllUnits({ page, size, search }),
  });
};