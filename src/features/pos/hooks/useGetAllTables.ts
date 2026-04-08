import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { posKeys } from "../keys/pos.keys";
import { getAllTables } from "../services/pos";
import { GetAllTablesResponse } from "../types/pos.types";

export const useGetAllTables = () =>
  useQuery<GetAllTablesResponse>({
    queryKey: posKeys.tables(),
    queryFn: () => getAllTables(),
  });
