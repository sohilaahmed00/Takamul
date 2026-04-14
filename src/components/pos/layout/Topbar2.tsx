import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, LogOut, Pause, Bug, Keyboard, Maximize } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { Treasury } from "@/features/treasurys/types/treasurys.types";
import ComboboxField from "@/components/ui/ComboboxField";
import { usePos } from "@/context/PosContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Topbar2() {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");
  const { data: customers } = useGetAllCustomers({ page: 1, limit: 10000 });
  const { data: treasurys } = useGetAllTreasurys();
  const { selectedCustomer, setSelectedCustomer } = usePos();
  const { t } = useLanguage();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  const now = new Date();
  const invoiceDate = now.toLocaleString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-full border border-gray-200 rounded-sm bg-white text-sm" dir="rtl">
      <div className="px-4 pt-3 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="w-7 h-7 border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="الصفحة الرئيسية">
                <Home size={13} />
              </Button>
              <Button variant="outline" size="icon" className="w-7 h-7 border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="لوحة المفاتيح">
                <Keyboard size={13} />
              </Button>
              <Button onClick={toggleFullScreen} variant="outline" size="icon" className="w-7 h-7 border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="ملء الشاشة">
                <Maximize size={13} />
              </Button>
            </div>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-1.5 flex-wrap">
              <Button variant="outline" size="sm" className="rounded-full h-7 text-[11px] border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200">
                شاشة المبيعات
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-blue-400">كود الفاتورة</span>
              <span className="text-[11px] font-semibold text-[#000052]">1010000000000011</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-blue-400">كود الوردية</span>
              <span className="text-[11px] font-semibold text-[#000052]">1010005</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-blue-400">تاريخ الفاتورة</span>
              <span className="text-[11px] font-semibold text-[#000052]">اليوم، {invoiceDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" className="rounded-full h-7 text-[11px] bg-[#000052] hover:bg-blue-900 hover:shadow-[0_0_0_3px_rgba(30,58,138,0.2)] transition-all duration-200">
              <Pause className="w-3 h-3" />
              غلق الوردية
            </Button>

            <Button size="sm" className="rounded-full h-7 text-[11px] bg-[#000052] hover:bg-blue-900 hover:shadow-[0_0_0_3px_rgba(30,58,138,0.2)] transition-all duration-200">
              تسجيل الخروج
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* ══ فاصل ══ */}
        <div className="h-px bg-gray-100" />

        {/* ══ الصف السفلي: الحقول ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {/* اختر العميل */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-[#000052]">اختر العميل</Label>
            <ComboboxField
              className="border-[#000052] text-[#000052]  text-[11px]"
              value={selectedCustomer ? String(selectedCustomer.id) : ""}
              onChange={(val) => {
                const c = customers?.items?.find((c) => String(c.id) === String(val));
                if (c) setSelectedCustomer(c);
              }}
              items={customers?.items}
              valueKey="id"
              labelKey="customerName"
              placeholder={t("choose_customer")}
            />
          </div>

          {/* وقت وتاريخ الاستلام */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-[#000052]">وقت وتاريخ الاستلام</Label>
            <Input type="datetime-local" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className=" text-[11px] bg-white border-[#000052] text-[#000052]" />
          </div>

          {/* المخزن */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-[#000052]">المخزن</Label>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger className="w-full text-[11px] bg-white border-[#000052] text-blue-900 rounded-sm">
                <SelectValue placeholder="اختر..." />
              </SelectTrigger>
              <SelectContent>
                {treasurys?.map((treasury: Treasury) => (
                  <SelectItem key={treasury.id} value={String(treasury.id)}>
                    {treasury.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* موظف الخدمة */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-[#000052]">موظف الخدمة</Label>
            <Select value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full text-[11px] bg-white border-[#000052] text-blue-900 rounded-sm">
                <SelectValue placeholder="اختر..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="e1">محمد علي</SelectItem>
                <SelectItem value="e2">سارة أحمد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ملاحظات */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-[#000052]">ملاحظات</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-10  text-[11px] bg-white border-[#000052] text-[#000052] rounded-sm resize-none py-1" rows={1} placeholder="أضف ملاحظة..." />
          </div>
        </div>
      </div>
    </div>
  );
}
