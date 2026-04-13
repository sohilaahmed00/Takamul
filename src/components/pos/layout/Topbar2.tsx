import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
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

  return (
    <div className="w-full" dir="rtl">
      {/* ── الشريط الأزرق العلوي ── */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a6fb5]">

        {/* يمين: أزرار العمليات */}
        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold gap-1 h-7 px-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          إلاغ عن مشكلة
        </Button>

        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold gap-1 h-7 px-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          على الوردية
        </Button>

        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold gap-1 h-7 px-2"
          onClick={() => navigate("/end-shift")}
        >
          <LogOut size={12} />
          تسجيل الخروج
        </Button>

        {/* وسط: شاشة المبيعات + أيقونات */}
        <div className="flex-1 flex justify-center items-center gap-2">
          <Button size="sm" variant="outline" className="bg-white text-[#1a6fb5] hover:bg-blue-50 text-[11px] font-bold h-7 px-3 border-white">
            شاشة المبيعات
          </Button>
          <button className="text-white hover:text-white/70 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
          <button className="text-white hover:text-white/70 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
          <button className="text-white hover:text-white/70 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
          </button>
        </div>

        {/* يسار: حقول الفاتورة */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex flex-col items-end">
            <span className="text-white/70">اختر العميل</span>
            <span className="text-white/40 text-[9px]">عميل نقدي ▾</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/70">وقت وتاريخ الاستلام</span>
            <span className="text-white/40 text-[9px]">mm/dd/yyyy --:-- --</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/70">المخزن</span>
            <span className="text-white/40 text-[9px]">مخزن رئيسي ▾</span>
          </div>
        </div>
      </div>

      {/* ── صف بيانات الفاتورة ── */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-3 py-1.5 text-[11px]">
        {/* يمين: تاريخ الفاتورة */}
        <div className="flex flex-col">
          <span className="text-gray-500">تاريخ الفاتورة</span>
          <span className="font-bold text-gray-800">اليوم، {formattedTime}</span>
        </div>

        {/* وسط: كود الوردية + كود الفاتورة */}
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-gray-500">كود الوردية</span>
            <span className="font-bold text-gray-800">1010005</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500">كود الفاتورة</span>
            <span className="font-bold text-gray-800">1010100000000011</span>
          </div>
        </div>

        {/* يسار: ملاحظات + موظف الخدمة */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-end">
            <span className="text-gray-500">ملاحظات</span>
            <div className="w-28 h-4 border-b border-gray-300" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500">موظف الخدمة</span>
            <span className="text-gray-400">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}