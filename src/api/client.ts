import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const axiosClient = axios.create({
  baseURL: API_BASE,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
