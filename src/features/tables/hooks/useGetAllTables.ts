import { useQuery } from "@tanstack/react-query";
import { tablesKeys } from "../keys/tables.keys";
import { getAllTables } from "../services/tables";
import { GetAllTablesResponse } from "../types/tables.types";

export const useGetAllTables = () =>
  useQuery<GetAllTablesResponse>({
    queryKey: tablesKeys.list(),
    queryFn: () => getAllTables(),
  });
