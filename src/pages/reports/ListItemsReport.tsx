import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Edit, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

export default function ListItemsReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [branch, setBranch] = useState('');

  const data = [
    { code: '21212121212121', name: 'مياه', branch: 'نشاط سوبرماركت', list: '50', price: '40.0000', cost: '50.0000' },
    { code: '21212121212121', name: 'مياه', branch: 'نشاط المطاعم', list: '50', price: '40.0000', cost: '50.0000' },
    { code: '21212121212121', name: 'مياه', branch: 'نشاط الكوفي / الديوانيه', list: '50', price: '40.0000', cost: '50.0000' },
    { code: '21212121212121', name: 'مياه', branch: 'نشاط الصالون', list: '50', price: '40.0000', cost: '50.0000' },
    { code: '21212121212121', name: 'مياه', branch: 'مغسلة سيارات', list: '50', price: '40.0000', cost: '50.0000' },
    { code: '21212121212121', name: 'مياه', branch: 'زهر للعبايات', list: '50', price: '40.0000', cost: '50.0000' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Settings className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">تقرير الأصناف بالليستة</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-col items-end gap-2">
          <label className="text-sm font-bold text-[var(--primary)]">الفرع</label>
          <div className="flex items-center gap-2 w-full md:w-1/3">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 text-right"
            >
              <option value="">اختر الفرع</option>
              <option value="1">نشاط سوبرماركت</option>
            </select>
          </div>
          <button className="bg-[var(--primary)] text-white px-6 py-2 rounded text-sm font-bold hover:bg-[var(--primary-hover)] transition-colors">اتمام العملية</button>
        </div>
      </div>

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
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الفرع</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الليسته</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">السعر</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تكلفة</th>
                <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.branch}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.list}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.price}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.cost}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-center">
                    <button className="text-[var(--primary)] hover:text-[var(--primary-hover)]"><Edit size={16} /></button>
                  </td>
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
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 1 إلى 6 من 6 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            <button className="px-2 py-1 bg-[var(--primary)] text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
