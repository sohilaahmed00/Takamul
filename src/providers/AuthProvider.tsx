import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { refreshToken } from "@/features/auth/services/auth";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { AppJwtPayload } from "@/types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const setAuth = useAuthStore((s) => s.setAuth);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const initAuth = async () => {
      try {
        // const data = await refreshToken();
        // const decoded = jwtDecode<AppJwtPayload>(data.accessToken);
        // setAuth(data.accessToken, new Date(data.accessTokenExpiration).getTime(), decoded.Permission);
      } catch {
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [setAuth, setInitialized]);

  return <>{children}</>;
};
