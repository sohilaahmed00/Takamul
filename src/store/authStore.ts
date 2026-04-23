import { create } from "zustand";
import type { Permission } from "@/lib/permissions";

type AuthState = {
  accessToken: string | null;
  expiresAt: number | null;
  permissions: Permission[];
  userId: string | null; // ← أضف
  email: string | null; // ← أضف
  userName: string | null; // ← أضف
  setAuth: (token: string, expiresAt: number, permissions: Permission[], userId: string, email: string, userName: string) => void;
  clearAuth: () => void;
  isExpired: () => boolean;
  isInitialized: boolean;
  setInitialized: (v: boolean) => void;
  hasAnyPermission: (permissions: (Permission | undefined)[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAllPermissions: (permissions: (Permission | undefined)[]) => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  expiresAt: null,
  permissions: [],
  isInitialized: false,
  userId: null,
  email: null,
  userName: null,
  setAuth: (token, expiresAt, permissions, userId, email, userName) =>
    set({
      accessToken: token,
      expiresAt,
      permissions,
      userId,
      email,
      userName,
      isInitialized: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      expiresAt: null,
      permissions: [],
    }),

  setInitialized: (v: boolean) => set({ isInitialized: v }),

  isExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },
  hasAnyPermission: (perms: (Permission | undefined | null)[]) => {
    const { permissions } = get();

    if (!Array.isArray(permissions) || !Array.isArray(perms)) return false;

    return perms.some((p) => {
      if (!p) return false;
      return permissions.includes(p);
    });
  },
  hasPermission: (permission) => {
    const { permissions } = get();

    return Array.isArray(permissions) && permissions.includes(permission);
  },
  hasAllPermissions: (perms) => {
    const { permissions } = get();
    if (!Array.isArray(permissions)) return false;
    return perms.every((p) => p && permissions.includes(p));
  },
}));
