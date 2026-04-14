// api/client.ts

import axios, { AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";
import { Permission } from "@/lib/permissions";

// ─── Client ───────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];
let initRefreshPromise: Promise<string> | null = null;

const resolvePendingRequests = (token: string) => {
  pendingRequests.forEach((req) => req.resolve(token));
  pendingRequests = [];
};

const rejectPendingRequests = (error: unknown) => {
  pendingRequests.forEach((req) => req.reject(error));
  pendingRequests = [];
};

const enqueueRequest = (requestConfig: AxiosRequestConfig): Promise<unknown> =>
  new Promise((resolve, reject) => {
    pendingRequests.push({
      resolve: (token) => {
        requestConfig.headers!.Authorization = `Bearer ${token}`;
        resolve(apiClient(requestConfig));
      },
      reject,
    });
  });

export const setInitRefreshPromise = (promise: Promise<string> | null): void => {
  initRefreshPromise = promise;
};

const applyToken = (requestConfig: AxiosRequestConfig, token: string): void => {
  requestConfig.headers!.Authorization = `Bearer ${token}`;
};

const handleRefreshSuccess = (token: string, expiration: string, permission: Permission[]): void => {
  useAuthStore.getState().setAuth(token, new Date(expiration).getTime(), permission);
};

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
console.log(accessToken)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isAlreadyRetried = originalRequest._retry;
    const isRefreshEndpoint = originalRequest.url?.includes("/Auth/refresh-token");

    if (!isUnauthorized || isAlreadyRetried || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    if (initRefreshPromise) {
      try {
        const token = await initRefreshPromise;
        console.log(token);
        originalRequest._retry = true;
        applyToken(originalRequest, token);
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    if (isRefreshing) {
      return enqueueRequest(originalRequest);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refreshToken();
      const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
      console.log(data);

      handleRefreshSuccess(data.accessToken, data.accessTokenExpiration, decoded.Permission);
      resolvePendingRequests(data.accessToken);
      applyToken(originalRequest, data.accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      rejectPendingRequests(refreshError);
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
