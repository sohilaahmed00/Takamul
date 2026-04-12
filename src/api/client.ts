import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueueItem {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}
// [{ reslove(token),reject(token)}]
// ─── Refresh State ────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshEndpoint = originalRequest.url?.includes("/Auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshToken();
        
        const newToken = data.accessToken;
        const decoded = jwtDecode<AppJwtPayload>(newToken);

        useAuthStore.getState().setAuth(newToken, new Date(data.accessTokenExpiration).getTime(), decoded?.Permission);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
