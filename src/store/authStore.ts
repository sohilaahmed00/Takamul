import { create } from "zustand";
import type { Permission } from "@/lib/permissions";

type AuthState = {
  accessToken: string | null;
  expiresAt: number | null;
  permissions: Permission[];
  userId: string | null;
  email: string | null;
  userName: string | null;
  setAuth: (token: string, expiresAt: number, permissions: Permission[], userId: string, email: string, userName: string) => void;
  clearAuth: () => void;
  isExpired: () => boolean;
  isInitialized: boolean;
  setInitialized: (v: boolean) => void;
  hasAnyPermission: (permissions: unknown) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: unknown) => boolean;
};

const toArray = (val: unknown): string[] => {
  if (!val) return [];
  if (typeof val === "string") return [val];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return Object.values(val as Record<string, unknown>).flatMap(toArray);
  return [];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  expiresAt: null,
  permissions: [],
  isInitialized: false,
  userId: null,
  email: null,
  userName: null,

  setAuth: (token, expiresAt, permissions, userId, email, userName) => {
    set({ accessToken: token, expiresAt, permissions, userId, email, userName, isInitialized: true });
  },

  clearAuth: () =>
    set({
      accessToken: null,
      expiresAt: null,
      permissions: [],
      userId: null,
      email: null,
      userName: null,
      isInitialized: true,
    }),

  setInitialized: (v: boolean) => set({ isInitialized: v }),

  isExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },

  hasAnyPermission: (val) => {
    const { permissions } = get();
    if (!Array.isArray(permissions)) return false;
    return toArray(val).some((p) => permissions.includes(p as Permission));
  },

  hasPermission: (permission) => {
    const { permissions } = get();
    return Array.isArray(permissions) && permissions.includes(permission);
  },

  hasAllPermissions: (val) => {
    const { permissions } = get();
    if (!Array.isArray(permissions)) return false;
    return toArray(val).every((p) => permissions.includes(p as Permission));
  },
}));
