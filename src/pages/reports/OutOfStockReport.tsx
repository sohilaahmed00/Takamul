import React, { useState } from 'react';
import { FileText, FileSpreadsheet, XCircle, MinusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'react-router-dom';

import { Input } from "@/components/ui/input";

export default function OutOfStockReport() {
  const { direction } = useLanguage();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isLosing = location.pathname.includes('losing');
  const title = isLosing ? 'تقرير الأصناف الخاسرة' : 'تقرير الاصناف النافذة';
  const Icon = isLosing ? MinusCircle : XCircle;

  const data = isLosing ? [
    { code: '21212121212121', number: '', name: 'مياه', price: '40.0000', cost: '50.0000' },
    { code: '6934290103346', number: '', name: 'حلاوه اوليفا شوكولاته', price: '26.0000', cost: '27.6600' },
    { code: '9555021513851', number: '', name: 'علي تي شاي الزنجبيل 20+5 مجانا', price: '23.0000', cost: '30.0000' },
    { code: '7613039093610', number: '', name: 'حليب مكثف الفستق نستلة 450جم', price: '15.0000', cost: '17.0000' },
    { code: '5000159535465', number: '', name: 'حلاوة سيليبريشن', price: '15.0000', cost: '23.0000' },
  ] : [
    { code: '4.762', number: '', name: 'عصير بدوايزر', price: '2079574.9000', cost: '0.0000' },
    { code: '44556688', number: '', name: 'ابجار ثلاجة بوك', price: '1035.0000', cost: '0.0000' },
    { code: '07613036135962', number: '', name: 'حليب مكثف نستلة كرتون', price: '380.0000', cost: '336.0000' },
    { code: '6281101490097', number: '', name: 'قهوه هرري باشنفر 10 كيلو', price: '355.0000', cost: '0.0000' },
    { code: '56281014800476', number: '', name: 'تزنا قودي تندرينا كرتون', price: '350.0000', cost: '337.0000' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="text-emerald-800" size={20} />
          <h1 className="text-lg font-bold text-emerald-800">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-emerald-600" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-green-600" /></button>
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
                <th className="px-3 py-2 border border-emerald-700 font-bold">رقم الصنف</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">اسم الصنف</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">السعر</th>
                <th className="px-3 py-2 border border-emerald-700 font-bold">تكلفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.number}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.price}</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.cost}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                <td colSpan={2} className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-emerald-800">
            عرض 1 إلى 10 من {isLosing ? '12' : '22,318'} سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            <button className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
