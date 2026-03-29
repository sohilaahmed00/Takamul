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

export async function httpClient<T>(
  url: string,
  options?: HttpClientOptions
): Promise<T> {
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
<<<<<<< HEAD
      const responseData = error.response?.data;

      if (typeof responseData === "string") {
        throw new Error(responseData);
      }

      if (responseData?.message) {
        throw new Error(responseData.message);
      }

      if (responseData?.title) {
        throw new Error(responseData.title);
      }

      throw new Error(error.message || "حدث خطأ أثناء الاتصال بالسيرفر");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("حدث خطأ غير متوقع");
  }
}
=======
      const data = error.response?.data;
      throw data;
    }

    throw error;
  }
}
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
