import React, { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchInvoiceReport() {
  const { direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = [
    { id: '361', date: '28/02/2026 23:59:31', ref: 'SALE/POS0446', cashier: 'شركة تجريبي', user: 'saad', customer: 'شخص عام', total: '9.00', paid: '9.00', current: '0.00', list: '0.00', noTax: '7.83', tax: '1.17', profit: '7.83', discount: '0.00', status: 'مدفوع' },
    { id: '360', date: '28/02/2026 16:58:05', ref: 'SALE/POS0445', cashier: 'شركة تجريبي', user: 'admin', customer: 'شخص عام', total: '13.00', paid: '13.00', current: '0.00', list: '0.00', noTax: '11.30', tax: '1.70', profit: '7.30', discount: '0.00', status: 'مدفوع' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="text-emerald-800" size={20} />
          <h1 className="text-lg font-bold text-emerald-800">البحث عن فاتورة</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-emerald-800" /></button>
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-emerald-800" /></button>
        </div>
      </div>

      <div className="text-emerald-800 text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-emerald-800">رقم الفاتورة</label>
            <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700 text-right" />
          </div>
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-emerald-800">الرقم المرجعي</label>
            <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700 text-right" />
          </div>
          <div className="space-y-1 text-right">
            <label className="text-sm font-bold text-emerald-800">عميل</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700 text-right">
              <option>اختر عميل</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="bg-emerald-600 text-white px-8 py-2 rounded text-sm font-bold hover:bg-emerald-700 transition-colors">اتمام العملية</button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">اظهار</span>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700">
              <option value={10}>10</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">بحث</span>
            <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-emerald-800 dark:bg-gray-700 w-full md:w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-right border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="px-1 py-2 border border-emerald-700 font-bold">رقم الفاتورة</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">التاريخ</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">الرقم المرجعي</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">كاشير</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">المستخدم</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">عميل</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">المجموع الكلي</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">مدفوع</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">الرصيد الحالي</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">سعر الليسته</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">الاجمالي بدون ضريبة</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">قيمة الضريبة</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">خصم</th>
                <th className="px-1 py-2 border border-emerald-700 font-bold">حالة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.id}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.date}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.ref}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.cashier}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.user}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.customer}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.total}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.paid}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.current}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.list}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.noTax}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.tax}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">{row.discount}</td>
                  <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">
                    <span className="bg-green-600 text-white px-1 rounded text-[8px]">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
              <tr>
                <td colSpan={11} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
                <td className="px-1 py-2 border border-gray-200 dark:border-gray-700">42.17</td>
                <td colSpan={2} className="px-1 py-2 border border-gray-200 dark:border-gray-700"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm font-bold text-emerald-800">
            عرض 1 إلى 10 من 361 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">5</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">4</button>
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
