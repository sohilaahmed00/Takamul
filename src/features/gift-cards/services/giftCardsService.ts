import { httpClient } from "@/api/httpClient";
import type { GiftCard, CreateGiftCardPayload, UpdateGiftCardPayload, getAllGiftCardsResponse } from "../types/giftCard.types";

export async function getGiftCards(params: { limit: number; page: number; SearchTerm?: string }) {
  return await httpClient<getAllGiftCardsResponse>("/GiftCards", {
    params: {
      Page: params.page,
      PageSize: params.limit,
      SearchTerm: params?.SearchTerm,
    },
  });
}

export async function getGiftCardById(id: number): Promise<GiftCard> {
  return await httpClient<GiftCard>(`/GiftCards/${id}`, { method: "GET" });
}

export async function createGiftCard(payload: CreateGiftCardPayload): Promise<any> {
  return await httpClient<{ message: string }>("/GiftCards", { method: "POST", data: payload });
}

export async function updateGiftCard(payload: UpdateGiftCardPayload) {
  return await httpClient<{ message: string }>("/GiftCards", { method: "PUT", data: payload });
}

export async function deleteGiftCard(id: number): Promise<any> {
  return await httpClient<any>(`/GiftCards/${id}`, { method: "DELETE" });
}
