import axios from "axios";
import { createAuthRefresh } from "axios-auth-refresh";
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const refreshAuthLogic = async (failedRequest: any) => {
  const data = await refreshToken();
  const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
  useAuthStore.getState().setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission, decoded?.UserId, decoded?.email, decoded?.username);
  failedRequest.response.config.headers.Authorization = `Bearer ${data.accessToken}`;
  return Promise.resolve();
};

createAuthRefresh(apiClient, refreshAuthLogic);
