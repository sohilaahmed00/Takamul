import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { posKeys } from "../keys/pos.keys";
import { getAllFreeTables, getAllTables } from "../services/pos";
import { GetAllTablesResponse } from "../types/pos.types";

export const useGetAllFreeTables = () =>
  useQuery<GetAllTablesResponse>({
    queryKey: posKeys.tablesFree(),
    queryFn: () => getAllFreeTables(),
  });
