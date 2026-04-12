import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Topbar2() {
  const { networkSpeed } = usePos();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 py-2 px-4 gap-4">
      {/* اليسار — الملف الشخصي */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User size={18} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-800">الكاشير</span>
          <span className="text-[10px] text-gray-400">الملف الشخصي</span>
        </div>
      </div>

      {/* اليمين — الساعة + إنهاء الوردية */}
      <div className="flex items-center gap-3">
        {/* Network speed */}
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${networkSpeed === "slow" ? "text-red-500" : networkSpeed === "medium" ? "text-yellow-500" : "text-green-500"}`}>{networkSpeed === "slow" ? t("speed_slow") : networkSpeed === "medium" ? t("speed_medium") : t("speed_fast")}</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={networkSpeed === "slow" ? "text-red-500" : networkSpeed === "medium" ? "text-yellow-500" : "text-green-500"}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeOpacity={networkSpeed === "slow" ? 0.3 : 1} />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeOpacity={networkSpeed === "fast" ? 1 : 0.3} />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeOpacity={networkSpeed !== "slow" ? 1 : 0.3} />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* الساعة والتاريخ */}
        <div className="flex flex-col items-center bg-gray-50 rounded-lg px-3 py-1.5">
          <span className="text-sm font-black text-gray-800 tabular-nums">{formattedTime}</span>
          <span className="text-[10px] text-gray-400">{formattedDate}</span>
        </div>

        {/* إنهاء الوردية */}
        <Button variant="destructive" size="lg"  className="text-xs font-semibold"  onClick={() => navigate("/end-shift")}>
          <LogOut size={14} />
          {"إنهاء الوردية"}
        </Button>
      </div>
    </div>
  );
}
