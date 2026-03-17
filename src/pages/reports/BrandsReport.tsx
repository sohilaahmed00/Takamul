import React, { useState } from 'react';
import { FileSpreadsheet, Tag, ChevronDown, ChevronUp, Image } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BrandsReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { name: 'gen', buy: '105.00', sell: '212.00', buyVal: '4,576.33', sellVal: '3,833.50', profit: '742.83-' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Tag className="text-emerald-800" size={20} />
          <h1 className="text-lg font-bold text-emerald-800">تقرير الماركات</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-emerald-800" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-emerald-800" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><Image size={16} className="text-emerald-800" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-emerald-600" /></button>
        </div>
      </div>

      <div className="text-emerald-800 text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">اظهار</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700"
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
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700 w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-3 py-2 border border-emerald-700 font-bold">الماركة</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">شراء</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">مباعة</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">قيمة مشتريات الصنف</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">قيمة الأصناف المباعة</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">الأرباح و / أو الخسارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.buy}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.sell}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.buyVal}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.sellVal}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.profit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الماركة]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">105.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">212.00</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">4,576.33</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">3,833.50</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">742.83-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-emerald-800">
            عرض 1 إلى 1 من 1 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">التالي &gt;</button>
            <button className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
