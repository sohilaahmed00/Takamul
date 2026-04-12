import React, { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";
import arJson from "@/locales/ar.json";
import enJson from "@/locales/en.json";
import urJson from "@/locales/ur.json";

type Language = "ar" | "en" | "ur";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  dir: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ar: { ...arJson },
  en: { ...enJson },
  ur: { ...urJson },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { systemSettings } = useSettings();

  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang === "ar" || savedLang === "en" || savedLang === "ur") return savedLang as Language;

    return systemSettings?.site?.language?.toLowerCase?.().includes("en")
      ? "en"
      : "ar";
  });

  useEffect(() => {
    const targetLang: Language = systemSettings?.site?.language
      ?.toLowerCase?.()
      .includes("en")
      ? "en"
      : "ar";

    if (language !== targetLang) {
      setLanguageState(targetLang);
    }
  }, [systemSettings?.site?.language]);

  const direction: Direction = language === "ar" || language === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", direction);
    localStorage.setItem("language", language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, defaultValue?: string) => {
    return (
      translations[language]?.[key] ||
      translations.ar?.[key] ||
      defaultValue ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, direction, dir: direction, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}