import { useQuery } from "@tanstack/react-query";
import { treasuryStatementKeys } from "../keys/treasuryStatement.keys";
import { getTreasuryStatement } from "../services/treasuryStatement";
import type {
  TreasuryStatementItem,
  TreasuryStatementQuery,
} from "../types/treasuryStatement.types";

export const useGetTreasuryStatement = (
  params: TreasuryStatementQuery | null
) =>
  useQuery<TreasuryStatementItem[]>({
    queryKey: treasuryStatementKeys.list({
      treasuryId: params?.treasuryId,
      from: params?.from,
      to: params?.to,
    }),
    queryFn: () => getTreasuryStatement(params as TreasuryStatementQuery),
    enabled: !!params?.treasuryId,
  });