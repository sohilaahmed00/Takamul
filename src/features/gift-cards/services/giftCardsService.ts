import { httpClient } from "@/api/httpClient";
import type { GiftCardApi, CreateGiftCardPayload, UpdateGiftCardPayload } from "../types/giftCard.types";

export async function getGiftCards(): Promise<GiftCardApi[]> {
  const response = await httpClient<GiftCardApi[]>("/GiftCards", { method: "GET" });
  return Array.isArray(response) ? response : [];
}

export async function getGiftCardById(id: number): Promise<GiftCardApi> {
  return await httpClient<GiftCardApi>(`/GiftCards/${id}`, { method: "GET" });
}

export async function createGiftCard(payload: CreateGiftCardPayload): Promise<any> {
  return await httpClient<any>("/GiftCards", { method: "POST", data: payload });
}

export async function updateGiftCard(payload: UpdateGiftCardPayload): Promise<any> {
  return await httpClient<any>("/GiftCards", { method: "PUT", data: payload });
}

export async function deleteGiftCard(id: number): Promise<any> {
  return await httpClient<any>(`/GiftCards/${id}`, { method: "DELETE" });
}