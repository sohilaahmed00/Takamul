import React, { useState } from 'react';
import { FileText, FileSpreadsheet, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

import { Input } from "@/components/ui/input";

export default function DetailedDailySalesReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const cards = [
    { title: 'إجمالي قيم المبيعات بدون ضريبة', value: '0.00', color: 'bg-orange-600' },
    { title: 'اجمالي ضريبة الصنف', value: '0.00', color: 'bg-blue-500' },
    { title: 'اجمالي رسوم التبغ', value: '0.00', color: 'bg-[var(--primary)]' },
    { title: 'اجمالي الخصم', value: '0.00', color: 'bg-indigo-600' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير المبيعات اليومية مفصل / تقرير الضرائب</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">تقرير المبيعات اليومية تفصيلي من 05/03/2026 إلى 05/03/2026</div>
      <div className="text-[var(--primary)] text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={cn("p-4 rounded-lg shadow-sm text-white flex flex-col items-center justify-center text-center space-y-1", card.color)}>
            <div className="text-xs font-bold">{card.title}</div>
            <div className="text-lg font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Table 1 */}
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
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">رقم الفاتورة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الحالة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الفرع</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الاجمالي بدون ضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">ضريبة الصنف</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">رسوم التبغ</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">المجموع الكلي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td colSpan={5} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Table 2 */}
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
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">رقم الفاتورة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الحالة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الفرع</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الاجمالي بدون ضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">ضريبة الصنف</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">المجموع الكلي</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td colSpan={5} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
