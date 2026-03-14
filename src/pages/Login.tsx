import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/Logo";
import { useLogin } from "@/features/auth/hooks/useLogin";
import axios from "axios";
import useToast from "@/hooks/useToast";

export default function Login() {
  const navigate = useNavigate();
  const { mutateAsync: login } = useLogin();
  const { theme, toggleTheme } = useTheme();
  const { t, direction, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess } = useToast();
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({
        email: username,
        password,
      });

      notifySuccess("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response);
        const message = err.response?.data?.message;
        notifyError(message);
      } else {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };
  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"}`} dir={direction}>
      <div className={`absolute top-6 ${direction === "rtl" ? "left-6" : "right-6"} flex items-center gap-4`}>
        <button onClick={toggleLanguage} className="text-sm font-medium text-gray-500 hover:text-[#10b981] transition-colors">
          {language === "ar" ? "English" : "عربي"}
        </button>
        <button onClick={toggleTheme} className="text-gray-500 hover:text-[#10b981] transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`w-full max-w-md p-8 sm:p-10 rounded-xl  border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex flex-col items-center mb-8 text-center">
          <Logo />
          <h1 className="text-2xl font-bold mt-6">{t("login")}</h1>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("welcome_login_message")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder={t("email")} className={`w-full p-4 rounded-xl outline-none transition-colors text-sm border focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} value={username} onChange={(e) => setUsername(e.target.value)} required />

          <input type="password" placeholder={t("password")} className={`w-full p-4 rounded-xl outline-none transition-colors text-sm border focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-red-500 py-1 text-center">{error}</p>}

          <div className="flex justify-between items-center text-sm py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#10b981] rounded border-gray-300" />
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>{t("remember_me")}</span>
            </label>
            <button type="button" onClick={() => navigate("/forgot-password")} className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"} hover:text-[#10b981] transition-colors`}>
              {t("forgot_password")}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 text-white text-base font-bold rounded-lg bg-[#10b981] hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? t("login_loading") : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}
