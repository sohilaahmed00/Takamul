import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, LogOut, Pause, Bug, Keyboard, Maximize } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Topbar2() {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [warehouse, setWarehouse] = useState("main");
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");

  const now = new Date();
  const invoiceDate = now.toLocaleString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-full border rounded-sm overflow-hidden text-sm" dir="rtl">
      <div className="px-3 py-2 flex flex-col gap-3 lg:flex-row lg:items-start">
        {/* ══ الحقول ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          <div className="flex flex-col gap-1">
            <Label className="text-[11px] text-[#000052] text-right">اختر العميل</Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-full text-xs bg-white border-[#000052] text-[#000052] rounded-sm">
                <SelectValue placeholder="عميل نقدي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">عميل نقدي</SelectItem>
                <SelectItem value="c1">أحمد محمد</SelectItem>
                <SelectItem value="c2">شركة النور</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[11px] text-[#000052] text-right">وقت وتاريخ الاستلام</Label>
            <Input type="datetime-local" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="text-xs bg-white border-[#000052] text-[#000052]" />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[11px] text-[#000052] text-right">المخزن</Label>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger className="w-full text-xs bg-white border-[#000052] text-blue-900 rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">مخزن رئيسي</SelectItem>
                <SelectItem value="branch1">مخزن الفرع الأول</SelectItem>
                <SelectItem value="branch2">مخزن الفرع الثاني</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#000052] text-right">موظف الخدمة</label>
            <Select value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full text-xs bg-white border-[#000052] text-blue-900 rounded-sm">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="e1">محمد علي</SelectItem>
                <SelectItem value="e2">سارة أحمد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[11px] text-[#000052] text-right">ملاحظات</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full min-h-10 text-xs bg-white border-[#000052] text-[#000052] rounded-sm resize-none py-1" rows={1} />
          </div>
        </div>

        {/* ══ الجانب الأيسر: الأزرار + معلومات الفاتورة ══ */}
        <div className="flex flex-col gap-2 lg:items-end lg:min-w-max">
          {/* صف الأزرار */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* أزرار الأيقونات */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="bg-transparent border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="الصفحة الرئيسية">
                <Home size={13} />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="لوحة المفاتيح">
                <Keyboard size={13} />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200" title="ملء الشاشة">
                <Maximize size={13} />
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent rounded-full text-xs border-[#000052] text-[#000052] hover:bg-[#000052] hover:text-white transition-colors duration-200">
                شاشة المبيعات
              </Button>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button variant="destructive" size="sm" className="rounded-full text-xs transition-all duration-200 hover:bg-red-800 hover:shadow-[0_0_0_3px_rgba(220,38,38,0.2)]">
                <Bug className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إلغاء عن مشكله</span>
              </Button>

              <Button variant="default" size="sm" className="rounded-full text-xs bg-[#000052] hover:bg-blue-900 hover:shadow-[0_0_0_3px_rgba(30,58,138,0.2)] transition-all duration-200">
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">غلق الوردية</span>
              </Button>

              <Button variant="default" size="sm" className="rounded-full text-xs bg-[#000052] hover:bg-blue-900 hover:shadow-[0_0_0_3px_rgba(30,58,138,0.2)] transition-all duration-200">
                <span className="hidden sm:inline">تسجيل الخروج</span>
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* معلومات الفاتورة */}
          <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 px-1 py-1 text-blue-900">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] text-blue-500">كود الفاتورة</span>
              <span className="text-xs font-semibold">1010000000000011</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] text-blue-500">كود الوردية</span>
              <span className="text-xs font-semibold">1010005</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] text-blue-500">تاريخ الفاتورة</span>
              <span className="text-xs font-semibold">اليوم، {invoiceDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
