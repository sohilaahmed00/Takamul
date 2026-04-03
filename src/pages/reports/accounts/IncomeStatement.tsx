import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Printer, Share2, Search } from 'lucide-react';

export default function IncomeStatement() {
  const { t, direction } = useLanguage();

  const data = [
    { code: '11110', name: 'بيلا', debit: 0, credit: 0, balance: 0 },
    { code: '4', name: 'الإيرادات', debit: 0, credit: 0, balance: 0 },
    { code: '41', name: 'صافي المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '4101', name: 'اجمالي المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '410101', name: 'اجمالي المبيعات الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '4102', name: 'مردودات المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '410201', name: 'مردودات مبيعات الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '4103', name: 'الخصم المسموح', debit: 0, credit: 0, balance: 0 },
    { code: '410301', name: 'خصم مسموح الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '42', name: 'الإيرادات الأخرى', debit: 0, credit: 0, balance: 0 },
    { code: '43', name: 'أرباح رأسمالية', debit: 0, credit: 0, balance: 0 },
    { code: '5', name: 'المصروفات', debit: 0, credit: 0, balance: 0 },
    { code: '51', name: 'صافي مشتريات', debit: 0, credit: 0, balance: 0 },
    { code: '5101', name: 'اجمالي المشتريات', debit: 0, credit: 0, balance: 0 },
    { code: '510101', name: 'اجمالي مشتريات الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '5102', name: 'مردودات مشتريات', debit: 0, credit: 0, balance: 0 },
    { code: '510201', name: 'مردودات مشتريات الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '5103', name: 'الخصم المكتسب', debit: 0, credit: 0, balance: 0 },
    { code: '510301', name: 'خصم مكتسب الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '52', name: 'تكلفة المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '5201', name: 'تكلفة المبيعات الفرع الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '53', name: 'مصروفات عمومية وإدارية', debit: 0, credit: 0, balance: 0 },
    { code: '5301', name: 'مصروفات الايجارات', debit: 0, credit: 0, balance: 0 },
    { code: '5302', name: 'مصروفات الكهرباء', debit: 0, credit: 0, balance: 0 },
    { code: '5303', name: 'مصروفات الرواتب', debit: 0, credit: 0, balance: 0 },
    { code: '5304', name: 'مصروفات نثريات', debit: 0, credit: 0, balance: 0 },
    { code: '5305', name: 'مصروفات اهلاك الأصول', debit: 0, credit: 0, balance: 0 },
    { code: '54', name: 'مصاريف تسويقية', debit: 0, credit: 0, balance: 0 },
    { code: '5401', name: 'مصاريف اهلاك الأصول', debit: 0, credit: 0, balance: 0 },
    { code: '540101', name: 'م. اهلاك السيارات', debit: 0, credit: 0, balance: 0 },
    { code: '540102', name: 'م. اهلاك الأجهزة الكهربائية', debit: 0, credit: 0, balance: 0 },
    { code: '5402', name: 'مصاريف متنوعة', debit: 0, credit: 0, balance: 0 },
    { code: '540201', name: 'استهلاك المياة', debit: 0, credit: 0, balance: 0 },
    { code: '540202', name: 'استهلاك الكهرباء', debit: 0, credit: 0, balance: 0 },
    { code: '5403', name: 'مصاريف بنكية', debit: 0, credit: 0, balance: 0 },
    { code: '5501', name: 'أعباء وخسائر', debit: 0, credit: 0, balance: 0 },
    { code: '550101', name: 'خسائر التالف والراكد ومنتهي الصلاحية', debit: 0, credit: 0, balance: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">قائمة الدخل</h1>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">إظهار:</span>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none">
                <option>الكل</option>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="p-3 border border-[var(--primary)]/30 font-bold">كود الحساب</th>
                  <th className="p-3 border border-[var(--primary)]/30 font-bold">اسم الحساب</th>
                  <th className="p-3 border border-[var(--primary)]/30 font-bold">مدين</th>
                  <th className="p-3 border border-[var(--primary)]/30 font-bold">دائن</th>
                  <th className="p-3 border border-[var(--primary)]/30 font-bold">الرصيد الحالي</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 text-sm font-mono">{item.code}</td>
                    <td className="p-3 text-sm font-medium">{item.name}</td>
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
