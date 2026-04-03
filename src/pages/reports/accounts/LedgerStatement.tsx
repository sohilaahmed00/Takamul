import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Printer, Share2, Search, Calendar } from 'lucide-react';

export default function LedgerStatement() {
  const { t, direction } = useLanguage();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const data = [
    { date: '2024-03-04', basedOn: 'رصيد بداية الفترة', ref: '-', notes: '-', debit: 0, credit: 0, balance: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">كشف حساب لحساب استاذ</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Printer size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Download size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كود الحساب</label>
              <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]">
                <option>اختر الحساب...</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الفرع *</label>
              <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]">
                <option>الكل</option>
                <option>الفرع الرئيسي</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تاريخ البداية</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تاريخ النهاية</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">إظهار رصيد ما قبل</label>
              <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--primary)]">
                <option>نعم</option>
                <option>لا</option>
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95">
                اتمام العملية
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">إظهار:</span>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>الكل</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">بناء علي</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">ملاحظات</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">المدين</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">الدائن</th>
                  <th className="p-3 border border-[var(--primary-hover)] font-bold">الرصيد الحالي</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 text-sm">{item.date}</td>
                    <td className="p-3 text-sm">{item.basedOn}</td>
                    <td className="p-3 text-sm">{item.ref}</td>
                    <td className="p-3 text-sm">{item.notes}</td>
                    <td className="p-3 text-sm text-center">{item.debit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center">{item.credit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center font-bold">{item.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">عرض 1 إلى {data.length} من {data.length} سجلات</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50" disabled>السابق</button>
              <button className="px-3 py-1 bg-[var(--primary)] text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50" disabled>التالي</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
