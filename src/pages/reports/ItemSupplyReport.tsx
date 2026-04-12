import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

export default function ItemSupplyReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data: any[] = []; // Empty as per image

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Download className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير توريد الأصناف</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><Printer size={16} className="text-gray-600" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

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
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">التاريخ</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">الرقم المرجعي</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">مورد</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">كود الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">كميات الأصناف</th>
                <th className="px-3 py-2 border border-[var(--primary)]/30 font-bold">تكلفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[(yyyy-mm-dd) التاريخ]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الرقم المرجعي]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[مورد]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">كميات الأصناف</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">ضريبة تكلفة</td>
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
