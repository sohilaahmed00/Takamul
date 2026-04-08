import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { posKeys } from "../keys/pos.keys";
import { getAllTables, getOrderByTableId } from "../services/pos";
import { GetAllTablesResponse, GetOrderByTableIdResponse } from "../types/pos.types";

export const useGetOrderByTableId = (id?: number) =>
  useQuery<GetOrderByTableIdResponse>({
    queryKey: posKeys.table(id),
    queryFn: () => getOrderByTableId(id),
    enabled: !!id,
  });
