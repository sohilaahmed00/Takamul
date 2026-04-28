import { posKeys } from "@/features/pos/keys/pos.keys";
import { genereateSerial } from "@/features/pos/services/pos";
import { GenereateSerialResponse } from "@/features/pos/types/pos.types";
import { useQuery } from "@tanstack/react-query";

export const useGenereateSerial = () =>
  useQuery<GenereateSerialResponse>({
    queryKey: posKeys.seiral(),
    queryFn: () => genereateSerial(),
    enabled: false,
  });
