import { useQuery } from "@tanstack/react-query";
import { getItems } from "../services/itemsService";
import { itemsKeys } from "../keys/items.keys";
import type { GetItemsParams } from "../types/items.types";

export const useGetItems = (params: GetItemsParams = {}) =>
  useQuery({
    queryKey: itemsKeys.list(params),
    queryFn: () => getItems(params),
  });