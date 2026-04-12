import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Grid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

export default function PromotionsReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { code: '6285835000102', name: 'جلكسي كراميل', unit: 'حبة', price: '79', promoPrice: '0', start: '', end: '' },
    { code: '6285835000102', name: 'جلكسي كراميل', unit: 'حبة', price: '79', promoPrice: '0', start: '', end: '' },
    { code: '6285835000102', name: 'جلكسي كراميل', unit: 'حبة', price: '79', promoPrice: '0', start: '', end: '' },
    { code: '6285835000102', name: 'جلكسي كراميل', unit: 'حبة', price: '79', promoPrice: '0', start: '', end: '' },
    { code: '5000159521468', name: 'سنيكرس كيس', unit: 'حبة', price: '16', promoPrice: '0', start: '', end: '' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Grid className="text-emerald-800" size={20} />
          <h1 className="text-lg font-bold text-emerald-800">تقرير العروض الترويجية</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-green-600" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-emerald-600" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><Printer size={16} className="text-gray-600" /></button>
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
            <Input
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
                <th className="px-3 py-2 border border-emerald-700 font-bold">كود الصنف</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">وحدة</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">السعر</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">السعر الترويجي</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">تاريخ البداية</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">تاريخ النهاية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.unit}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.price}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.promoPrice}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.start}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.end}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                <td colSpan={5} className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-emerald-800">
            عرض 1 إلى 10 من 26 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">3</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">2</button>
            <button className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
