import { useQuery } from "@tanstack/react-query";
import { getAllRevenues } from "../services/revenues";
import { revenuesKeys } from "../keys/revenues.keys";

export default function useGetAllRevenues() {
  return useQuery({
    queryKey: revenuesKeys.all,
    queryFn: getAllRevenues,
  });
}