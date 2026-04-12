import React, { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

export default function UnpaidInvoicesReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">الفواتير الغير مسددة</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-[var(--primary)]">تاريخ البداية</label>
            <Input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 text-right" />
          </div>
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-[var(--primary)]">تاريخ النهاية</label>
            <Input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 text-right" />
          </div>
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-[var(--primary)]">عميل</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 text-right">
              <option>اختر عميل</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="bg-[var(--primary)] text-white px-8 py-2 rounded text-sm font-bold hover:bg-[var(--primary-hover)] transition-colors">اتمام العملية</button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">اظهار</span>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700">
              <option value={10}>10</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">بحث</span>
            <Input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 w-full md:w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">رقم الفاتورة</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">التاريخ</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">الرقم المرجعي</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">كاشير</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">المستخدم</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">عميل</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">المجموع الكلي</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">مدفوع</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">الرصيد الحالي</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">سعر الليسته</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">الاجمالي بدون ضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">قيمة الضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">خصم</th>
                <th className="px-1 py-2 border border-[var(--primary)]/30 font-bold">حالة الدفع</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={14} className="px-3 py-4 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td colSpan={10} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td colSpan={2} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 0 إلى 0 من 0 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">التالي &gt;</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
