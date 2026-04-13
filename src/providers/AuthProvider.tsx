import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import "@/lib/initAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialized = useAuthStore((s) => s.isInitialized);

  const ENABLE_AUTO_REFRESH = true;

  useEffect(() => {
    if (!ENABLE_AUTO_REFRESH) return;

    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  if (!initialized) return null;

  return <>{children}</>;
};
