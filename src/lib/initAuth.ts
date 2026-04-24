// auth/initAuth.ts
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";

export const initAuth = async (): Promise<void> => {
  try {
    const data = await refreshToken();
    const decoded = jwtDecode<AppJwtPayload>(data.accessToken);

    useAuthStore.getState().setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission, decoded?.UserId, decoded?.email, decoded?.username);
  } catch {
    useAuthStore.getState().clearAuth();
  } finally {
    useAuthStore.getState().setInitialized(true);
  }
};
