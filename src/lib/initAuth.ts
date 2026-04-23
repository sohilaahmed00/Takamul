// auth/initAuth.ts

import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode } from "jwt-decode";
import { AppJwtPayload } from "@/types";
import { setInitRefreshPromise } from "@/api/client";

const promise = refreshToken()
  .then((data) => {
    const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
    useAuthStore.getState().setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission, decoded?.UserId, decoded?.email, decoded?.username);
    return data.accessToken;
  })
  .catch(() => {
    useAuthStore.getState().clearAuth();
    return "";
  })
  .finally(() => {
    setInitRefreshPromise(null);
    useAuthStore.getState().setInitialized(true);
  });
console.log("first");

setInitRefreshPromise(promise);

export { promise as initAuthPromise };
