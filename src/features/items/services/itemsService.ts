import { httpClient } from "@/api/httpClient";
import type {
  Item,
  ItemsResponse,
  CreateItemPayload,
  UpdateItemPayload,
  GetItemsParams,
} from "../types/items.types";

export const getItems = (params: GetItemsParams = {}) => {
  const qs = new URLSearchParams();
  if (params.page) qs.append("page", String(params.page));
  if (params.pageSize) qs.append("pageSize", String(params.pageSize));
  if (params.searchTerm) qs.append("searchTerm", params.searchTerm);
  const query = qs.toString();
  return httpClient<ItemsResponse>(`/Items${query ? `?${query}` : ""}`);
};

export const getItemById = (id: number) =>
  httpClient<Item>(`/Items/${id}`);

export const createItem = (data: CreateItemPayload) =>
  httpClient<string>("/Items", { method: "POST", data });

export const updateItem = (id: number, data: UpdateItemPayload) =>
  httpClient<string>(`/Items/${id}`, { method: "PUT", data });

export const deleteItem = (id: number) =>
  httpClient<string>(`/Items/${id}`, { method: "DELETE" });