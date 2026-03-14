import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_API_BASE = import.meta.env.VITE_API_BASE || "http://takamulerp.runasp.net";

export function localizeAuthError(rawMessage: string, t: (key: string) => string, fallbackKey: string): string {
  const n = (rawMessage || "").trim().replace(/^\./, "");

  if (/one or more validation errors/i.test(n)) {
    return t("error_validation");
  }

  if (/invalid|unauthorized|incorrect credentials/i.test(n)) {
    return t(fallbackKey);
  }

  return rawMessage || t(fallbackKey);
}
