// AuthProvider.tsx

import { useAuthStore } from "@/store/authStore";
import "@/lib/initAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialized = useAuthStore((s) => s.isInitialized);

  if (!initialized) return null;

  return <>{children}</>;
};
