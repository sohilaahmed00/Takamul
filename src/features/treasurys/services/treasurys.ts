import { httpClient } from "@/api/httpClient";
import type {
  CreateTreasuryPayload,
  GetAllTreasurysResponse,
  Treasury,
  UpdateTreasuryPayload,
} from "../types/treasurys.types";

export const getAllTreasurys = () =>
  httpClient<GetAllTreasurysResponse>("/Treasurys");

export const getTreasuryById = (id: number) =>
  httpClient<Treasury>(`/Treasurys/${id}`);

export const createTreasury = (data: CreateTreasuryPayload) =>
  httpClient<Treasury>("/Treasurys", {
    method: "POST",
    data,
  });

export const updateTreasury = (data: UpdateTreasuryPayload) =>
  httpClient<Treasury>(`/Treasurys/${data.id}`, {
    method: "PUT",
    data: {
      name: data.name,
      openingBalance: data.openingBalance ?? 0,
    },
  });

export const deleteTreasury = (id: number) =>
  httpClient<string>(`/Treasurys/${id}`, {
    method: "DELETE",
  });

export const depositToTreasury = (data: { treasuryId: number; amount: number }) =>
  httpClient<string>("/Treasurys/deposit", {
    method: "POST",
    data,
  });

export const withdrawFromTreasury = (data: { treasuryId: number; amount: number }) =>
  httpClient<string>("/Treasurys/withdraw", {
    method: "POST",
    data,
  });