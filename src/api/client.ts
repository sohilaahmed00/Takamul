import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";
import { LoginResponse } from "@/features/auth/types/auth.types";

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

apiClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        apiClient
          .post<LoginResponse>("/Auth/refresh-token")
          .then(({ data }) => {
            const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
            useAuthStore.getState().setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission, decoded?.UserId, decoded?.email, decoded?.username);
            apiClient.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
            originalRequest.headers["Authorization"] = "Bearer " + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  },
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const originalRequest = err.config;

    if (err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axios
          .post<LoginResponse>("/Auth/refresh-token")
          .then(({ data }) => {
            const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
            useAuthStore.getState().setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission, decoded?.UserId, decoded?.email, decoded?.username);
            axios.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
            originalRequest.headers["Authorization"] = "Bearer " + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  },
);
