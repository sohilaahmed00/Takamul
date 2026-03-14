import type { LoginPayload, LoginResponse } from "../types/auth.types";
import { httpClient } from "@/api/httpClient";

// ===================
// GET
// ===================

export const login = (data: LoginPayload) =>
  httpClient<LoginResponse>("/Auth/login", {
    method: "POST",
    data,
  });

// export const getCategoryClient = (idOrSlug: string | number) =>
//   httpClient<Category>(`/categories/${idOrSlug}`);

// ===================
// MUTATIONS (Dashboard)
// ===================
