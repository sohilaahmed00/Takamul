import { httpClient } from "@/api/httpClient";
import type {
  TreasuryStatementItem,
  TreasuryStatementQuery,
} from "../types/treasuryStatement.types";

export const getTreasuryStatement = (params: TreasuryStatementQuery) =>
  httpClient<TreasuryStatementItem[]>("/Treasurys/statement", {
    method: "GET",
    params,
  });