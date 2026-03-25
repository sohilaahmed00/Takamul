import axios from "axios";
import { axiosClient } from "./client";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpClientOptions = {
  method?: HttpMethod;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
};

export async function httpClient<T>(url: string, options?: HttpClientOptions): Promise<T> {
  try {
    const response = await axiosClient({
      url,
      method: options?.method ?? "GET",
      params: options?.params,
      data: options?.data,
      headers: options?.headers,
      responseType: options?.responseType ?? "json",
    });

    return response.data as T;
  } catch (error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // لو Validation Error
    if (data?.errors) {
      throw {
        type: "validation",
        message: data.title,
        errors: data.errors,
        status: data.status,
      };
    }

    // Error عادي
    throw {
      type: "api",
      message: data?.message || data?.title || "API Error",
      data,
      status: error.response?.status,
    };
  }

  throw error;
}
}
