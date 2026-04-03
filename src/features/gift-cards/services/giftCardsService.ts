import { httpClient } from "@/api/httpClient";
import type { GiftCard, CreateGiftCardPayload, UpdateGiftCardPayload } from "../types/giftCard.types";

export async function getGiftCards(): Promise<GiftCard[]> {
  const response = await httpClient<GiftCard[]>("/GiftCards", { method: "GET" });
  return Array.isArray(response) ? response : [];
}

export async function getGiftCardById(id: number): Promise<GiftCard> {
  return await httpClient<GiftCard>(`/GiftCards/${id}`, { method: "GET" });
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