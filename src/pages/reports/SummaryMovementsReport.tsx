import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  FileText,
  Lock,
  PlusCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

const SummaryMovementsReport = () => {
  const { dir } = useLanguage();
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-05');

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>البداية</span>
        <span>/</span>
        <span>التقارير</span>
        <span>/</span>
        <span className="text-[var(--primary)] font-medium">تقرير حركات مختصرة</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-t-lg border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Lock className="w-4 h-4" />
            <h1 className="text-lg font-bold">تقرير حركات مختصرة من {startDate} إلى {endDate} 23:59:59</h1>
          </div>
          <div className="flex gap-2">
             <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[var(--primary)] font-medium mb-6">يرجى تخصيص التقرير أدناه</p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-[var(--primary)] font-bold mb-2">مدخل البيانات</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white">
              <option>اختر المستخدم</option>
            </select>
          </div>
          <div>
            <label className="block text-[var(--primary)] font-bold mb-2">كاشير</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white">
              <option>اختر كاشير</option>
            </select>
          </div>
          <div>
            <label className="block text-[var(--primary)] font-bold mb-2">الفرع</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white">
              <option>اختر الفرع</option>
            </select>
          </div>
          <div>
            <label className="block text-[var(--primary)] font-bold mb-2">تاريخ البداية</label>
            <Input 
              type="date" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[var(--primary)] font-bold mb-2">تاريخ النهاية</label>
            <Input 
              type="date" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button className="bg-[var(--primary)] text-white px-8 py-2 rounded font-bold hover:bg-[var(--primary-hover)] transition-colors w-full md:w-auto">
              اتمام العملية
            </button>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Column 1 */}
          <div className="space-y-2 border border-gray-200 rounded p-3">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">شبكة:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">نقدي:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-[var(--primary)] font-bold">سداد من رصيد العميل:</span>
              <span className="text-[var(--primary)] font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">نقاطي:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">تحويل بنكي:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">استبدال:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">بطاقة هدايا:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">تابي:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">تمارا:</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-[var(--primary)] font-bold">مبيعات الدين:</span>
              <span className="text-[var(--primary)] font-bold">0.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-bold">مجموع المبيعات:</span>
              <span className="font-bold">0.00</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2 border border-gray-200 rounded p-3">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المشتريات و المدفوعات النقدي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المشتريات والمدفوعات الشبكة</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المشتريات والمدفوعات الشيك</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المشتريات والمدفوعات التحويل البنكي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المشتريات واشعارات الدائن</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">الاجمالي الكلي لمدفوعات الموردين</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">مجموع المشتريات و المدفوعات</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-bold text-sm">اجمالي مديونيات الشركات</span>
              <span className="font-bold">0.00</span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-2 border border-gray-200 rounded p-3">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">المصروفات النقدي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">المصروفات الشبكة</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">المصروفات الشيك</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">المصروفات التحويل البنكي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">مجموع المصروفات</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-600 font-bold">سندات قبض النقدية</span>
                <span className="font-bold">500.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 font-bold">سندات صرف النقدية</span>
                <span className="font-bold">0.00</span>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="space-y-2 border border-gray-200 rounded p-3">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">ايداعات العملاء النقدي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold">ايداعات العملاء الشبكة</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">ايداعات العملاء الشيك</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600 font-bold text-sm">ايداعات العملاء التحويل البنكي</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-bold">مجموع الايداعات</span>
              <span className="font-bold">0.00</span>
            </div>
          </div>
        </div>

        {/* Available Balance Section */}
        <div className="max-w-md mx-auto border border-gray-200 rounded overflow-hidden">
          <div className="bg-gray-50 p-3 text-center border-b border-gray-200 font-bold text-gray-700">الرصيد المتوفر</div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[var(--primary)] font-bold cursor-pointer">
                <PlusCircle className="w-4 h-4" />
                <span>إضافة تحويل بنكي</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-gray-600 font-bold">العمليات النقدية</span>
                <span className="font-bold">500.00</span>
              </div>
            </div>
            <div className="flex justify-between bg-gray-50 p-2 rounded">
              <span className="text-gray-600 font-bold">العمليات الشبكة</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-gray-600 font-bold">التحويلات البنكية</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-2 rounded">
              <span className="text-gray-600 font-bold">أرباح المبيعات</span>
              <span className="font-bold">0.00</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="text-gray-600 font-bold text-sm">الأرباح بعد خصم المشتريات والمصروفات</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-2 rounded">
              <span className="text-gray-600 font-bold">اجمالي مديونيات الشركات</span>
              <span className="font-bold">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryMovementsReport;
