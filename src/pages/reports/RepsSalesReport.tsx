import React, { useState } from 'react';
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

export default function RepsSalesReport() {
  const { direction, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { name: t("general"), total: '23774.3500' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <RefreshCw className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير مبيعات المندوبين / الموظفين</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

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
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">المندوب / الموظف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">مجموع المبيعات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[المندوب / الموظف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[المجموع] 23774.3500</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 1 إلى 1 من 1 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">التالي &gt;</button>
            <button className="px-2 py-1 bg-[var(--primary)] text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
