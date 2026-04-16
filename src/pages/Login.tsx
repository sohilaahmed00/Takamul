import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import axios from "axios";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/Logo";
import { useLogin } from "@/features/auth/hooks/useLogin";
import useToast from "@/hooks/useToast";

import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync: login } = useLogin();
  const { theme, setTheme } = useTheme();
  const { t, direction, language, setLanguage } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ identifier: username, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.response?.data?.title || "فشل تسجيل الدخول";
        setError(message);
        notifyError(message);
      } else if (err instanceof Error) {
        setError(err.message);
        notifyError(err.message);
      } else {
        setError("حدث خطأ غير متوقع");
        notifyError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-card)] relative overflow-hidden" dir={direction}>
      <div className={`absolute top-6 ${direction === "rtl" ? "left-6" : "right-6"} flex items-center gap-6`}>
        <div className="flex items-center gap-2 text-sm font-medium dir-ltr">
          <button onClick={() => setLanguage("ar")} className={`transition-colors ${language === "ar" ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}>
            عربي
          </button>
          <span className="text-[var(--border)]">|</span>
          <button onClick={() => setLanguage("en")} className={`transition-colors ${language === "en" ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}>
            English
          </button>
          <span className="text-[var(--border)]">|</span>
          <button onClick={() => setLanguage("ur")} className={`transition-colors ${language === "ur" ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}>
            اردو
          </button>
        </div>

        <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-xl border transition-colors duration-300 bg-[var(--bg-card)] border-[var(--border)] shadow-xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <Logo />
          <h1 className="text-2xl font-bold mt-6">{t("login")}</h1>
          <p className="text-sm mt-2 text-[var(--text-muted)]">{t("welcome_login_message")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="text" placeholder={t("email")} className="w-full p-4 rounded-xl outline-none transition-colors text-sm border focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--input-bg)] border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)]" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <Input type="password" placeholder={t("password")} className="w-full p-4 rounded-xl outline-none transition-colors text-sm border focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--input-bg)] border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)]" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-red-500 py-1 text-center">{error}</p>}

          <div className="flex justify-between items-center text-sm py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Input type="checkbox" className="w-4 h-4 accent-[var(--primary)] rounded border-[var(--border)]" />
              <span className="text-[var(--text-muted)]">{t("remember_me")}</span>
            </label>

            <button type="button" onClick={() => navigate("/forgot-password")} className="font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              {t("forgot_password")}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 text-white text-base font-bold rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? t("login_loading") : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}
