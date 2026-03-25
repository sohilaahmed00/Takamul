import { httpClient } from "@/api/httpClient";
import type {
  CreateInternalTreasuryTransferPayload,
  GetAllInternalTreasuryTransfersResponse,
  InternalTreasuryTransferApiItem,
} from "../types/internalTreasuryTransfers.types";

export const createInternalTreasuryTransfer = (
  data: CreateInternalTreasuryTransferPayload
) =>
  httpClient<string>("/Treasurys/transfer", {
    method: "POST",
    data,
  });

export const getAllInternalTreasuryTransfers = () =>
  httpClient<GetAllInternalTreasuryTransfersResponse>(
    "/Treasurys/GetAllTreasuryTransfer"
  );

export const getInternalTreasuryTransferById = (id: number) =>
  httpClient<InternalTreasuryTransferApiItem>(`/Treasurys/GetTransferById${id}`);