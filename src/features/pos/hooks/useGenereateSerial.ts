import { useQuery } from "@tanstack/react-query";
import { posKeys } from "../keys/pos.keys";
import { genereateSerial, getOrderByTableId } from "../services/pos";
import { GenereateSerialResponse } from "../types/pos.types";

export const useGenereateSerial = () =>
  useQuery<GenereateSerialResponse>({
    queryKey: posKeys.seiral(),
    queryFn: () => genereateSerial(),
  });
