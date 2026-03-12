import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Search, Grid, User, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function CashierSalesSummaryReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { cashier: 'شركة تجريبي', total: '24,238.95', paid: '24,063.60', current: '175.35', list: '50.00', noTax: '21,678.98', tax: '2,574.76', profit: '18,970.61' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Share2 className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير مبيعات الكاشير اجمالي</h1>
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
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700"
            >
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">بحث</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">كاشير</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">المجموع الكلي</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">مدفوع</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الرصيد الحالي</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">سعر الليسته</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الاجمالي بدون ضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">قيمة الضريبة</th>
                <th className="px-1 py-2 border border-[var(--primary-hover)] font-bold">الربح</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.cashier}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.total}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.paid}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.current}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.list}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.noTax}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.tax}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.profit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كاشير]</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">24,238.95</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">24,063.60</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">175.35</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">50.00</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">21,678.98</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">2,574.76</td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">18,970.61</td>
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
