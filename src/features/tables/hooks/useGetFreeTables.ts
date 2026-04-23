import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetAllTablesResponse } from "../types/tables.types";
import { tablesKeys } from "../keys/tables.keys";
import { getAllFreeTables } from "../services/tables";

export const useGetAllFreeTables = () =>
  useQuery<GetAllTablesResponse>({
    queryKey: tablesKeys.tablesFree(),
    queryFn: () => getAllFreeTables(),
  });
