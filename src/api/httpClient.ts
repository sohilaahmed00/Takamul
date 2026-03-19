import { axiosClient } from "./client";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpClientOptions = {
  method?: HttpMethod;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
};

<<<<<<< HEAD
export async function httpClient<T>(
  url: string,
  options?: HttpClientOptions
): Promise<T> {
  const response = await axiosClient({
    url,
    method: options?.method ?? "GET",
    params: options?.params,
    data: options?.data,
    headers: options?.headers,
    responseType: options?.responseType ?? "json",
  });

  return response.data as T;
}
=======
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
    // console.log("API ERROR:", error.response?.data);
    throw error;
  }
}
>>>>>>> 7e375b1 (Finish Categories & Products & Additions)
