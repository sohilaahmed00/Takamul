import { httpClient } from "@/api/httpClient";
import type {
  Revenue,
  CreateRevenuePayload,
  UpdateRevenuePayload,
} from "../types/revenues.types";

export const getAllRevenues = () =>
  httpClient<Revenue[]>("/Revenues");

export const getRevenueById = (id: number) =>
  httpClient<Revenue>(`/Revenues/${id}`);

export const createRevenue = (data: CreateRevenuePayload) =>
  httpClient<string>("/Revenues", { method: "POST", data });

// ✅ PUT يقبل name, amount, date, notes, treasuryId, itemId
export const updateRevenue = (
  id: number,
  data: Omit<UpdateRevenuePayload, "id">
) =>
  httpClient<string>(`/Revenues/${id}`, { method: "PUT", data });

export const deleteRevenue = (id: number) =>
  httpClient<string>(`/Revenues/${id}`, { method: "DELETE" });