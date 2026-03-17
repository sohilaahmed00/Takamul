import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function StockBalanceReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { code: '21212121212121', name: 'مياه', opening: '0.0000', adj: '100.0000', buy: '0.0000', transIn: '0.0000', transOut: '0.0000', sell: '1.0000', current: '99.0000', cost: '50.00', totalCost: '4,950.00' },
    { code: '75448610', name: 'قهوه تركيه غامق', opening: '0.0000', adj: '20.0000', buy: '0.0000', transIn: '0.0000', transOut: '0.0000', sell: '0.0000', current: '20.0000', cost: '0.00', totalCost: '0.00' },
    { code: '6972253511920', name: 'حلاقة ذقن', opening: '0.0000', adj: '10.0000', buy: '0.0000', transIn: '0.0000', transOut: '0.0000', sell: '32.0000', current: '22.0000-', cost: '0.00', totalCost: '0.00' },
    { code: '13032304', name: 'بندق', opening: '0.0000', adj: '3.0000', buy: '0.0000', transIn: '0.0000', transOut: '0.0000', sell: '0.0000', current: '3.0000', cost: '0.00', totalCost: '0.00' },
    { code: '64402228', name: 'تنظيف بشرة', opening: '0.0000', adj: '1.0000', buy: '0.0000', transIn: '0.0000', transOut: '0.0000', sell: '64.0000', current: '63.0000-', cost: '0.00', totalCost: '0.00' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Target className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير رصيد المخزون خلال فترة</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
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
            <input
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
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">رصيد ما قبل</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">التعديلات الكمية</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">شراء</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تحويل مخزون(وارد)</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تحويل مخزون(منصرف)</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">مباعة</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الرصيد الحالي</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كلفة</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">إجمالي التكلفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.opening}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.adj}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.buy}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.transIn}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.transOut}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.sell}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.current}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.cost}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.totalCost}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">135.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">97.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">38.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">64.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-right">مباعة</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 1 إلى 10 من 22,419 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">5</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">4</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">3</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">2</button>
            <button className="px-2 py-1 bg-[var(--primary)] text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
