import { apiClient } from "@/api/client";
import type { LoginPayload, LoginResponse } from "../types/auth.types";
import { httpClient } from "@/api/httpClient";
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

// ===================
// GET
// ===================

export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponse>("/Auth/refresh-token");
  return response.data;
};
export const logout = () =>
  httpClient<LoginResponse>("/Auth/logout", {
    method: "POST",
  });

export const login = async (credentials: LoginPayload) => {
  const response = await apiClient.post<LoginResponse>("/Auth/login", credentials, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
  return response.data;
};
// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// ===================
