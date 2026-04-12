import React, { useState } from 'react';
import { Camera, Calendar, Landmark } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'react-router-dom';

import { Input } from "@/components/ui/input";

export default function ExpiryReport() {
  const { direction } = useLanguage();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isAlert = location.pathname.includes('alert');
  const title = isAlert ? 'تنبيه صلاحية الأصناف (جميع الفروع)' : 'تقرير تواريخ انتهاء الأصناف (جميع الفروع)';

  const data: any[] = []; // Empty as per image

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><Landmark size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.</div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">اظهار</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">بحث</span>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">صورة</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كمية</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الفرع</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تاريخ انتهاء الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-center"><Camera size={16} className="text-gray-400 inline" /></td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.qty}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.branch}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.expiry}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">صورة [كود الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كمية]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الفرع]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[التاريخ (yyyy-mm-dd)]</td>
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
