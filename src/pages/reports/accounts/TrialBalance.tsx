import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Printer, Share2, Search } from 'lucide-react';

import { Input } from "@/components/ui/input";

export default function TrialBalance() {
  const { t, direction } = useLanguage();

  const data = [
    { code: '1', name: 'الأصول', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '11', name: 'الأصول المتداولة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1101', name: 'نقدية بالصناديق', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110101', name: 'صندوق رئيسي', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1102', name: 'نقدية بالبنوك', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110201', name: 'البنك الرئيسي', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110202', name: 'حساب نقاط البيع', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1103', name: 'عهد', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110301', name: 'العهد المستديمة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110302', name: 'العهد المؤقتة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '11030201', name: 'عهدة الأجهزة التقنية', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1104', name: 'شيكات تحت التحصيل', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1105', name: 'شيكات مرتدة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1106', name: 'أوراق قبض', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1107', name: 'العملاء', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1108', name: 'المخزون', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '110801', name: 'المخزون الرئيسي', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1109', name: 'الاعتمادات المستندية', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1110', name: 'ذمم العاملين', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1111', name: 'المدينون', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '11110', name: 'بيلا', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1112', name: 'الأرصدة المدينة الأخرى', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '111201', name: 'المصروفات المدفوعة مقدما', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '11120101', name: 'إيجارات مدفوعة مقدماً', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '111202', name: 'إيرادات مستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '111203', name: 'ضريبة القيمة المضافة على المبيعات', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '12', name: 'الأصول غير متداولة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1201', name: 'السيارات بالصافي', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '120101', name: 'السيارات', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '120102', name: 'مجمع اهلاك السيارات', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '1202', name: 'الأجهزة الكهربائية بالصافي', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '120201', name: 'الأجهزة الكهربائية', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '120202', name: 'مجمع اهلاك الأجهزة الكهربائية', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '13', name: 'أصول أخرى', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '14', name: 'مجمع الإهلاك', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2', name: 'الخصوم', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '21', name: 'الخصوم المتداولة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2101', name: 'الموردين', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2102', name: 'الدائنون', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103', name: 'الأرصدة الدائنة الأخرى', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '210301', name: 'مستحقات الموظفين', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '21030101', name: 'الرواتب المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010101', name: 'رواتب الفنيين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010102', name: 'رواتب الإداريين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010103', name: 'رواتب العمال المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '21030102', name: 'العمولات المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010201', name: 'عمولة الفنيين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010202', name: 'عمولة المحصلين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '21030103', name: 'بدلات الأجازة المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010301', name: 'بدلات أجازة الفنيين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '2103010302', name: 'بدلات أجازة الإداريين المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
    { code: '210302', name: 'الإيجارات المستحقة', prevDebit: 0, prevCredit: 0, periodDebit: 0, periodCredit: 0, afterDebit: 0, afterCredit: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">ميزان مراجعة الاستاذ العام</h1>
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
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
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
            <table className="w-full text-right border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th rowSpan={2} className="p-3 border border-[var(--primary-hover)] font-bold">كود الحساب</th>
                  <th rowSpan={2} className="p-3 border border-[var(--primary-hover)] font-bold">اسم الحساب</th>
                  <th colSpan={2} className="p-2 border border-[var(--primary-hover)] font-bold text-center">رصيد ما قبل</th>
                  <th colSpan={2} className="p-2 border border-[var(--primary-hover)] font-bold text-center">رصيد الفترة</th>
                  <th colSpan={2} className="p-2 border border-[var(--primary-hover)] font-bold text-center">رصيد ما بعد</th>
                </tr>
                <tr className="bg-[var(--primary)] opacity-90 text-white">
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">المدين</th>
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">الدائن</th>
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">المدين</th>
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">الدائن</th>
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">المدين</th>
                  <th className="p-2 border border-[var(--primary-hover)] font-bold text-center text-xs">الدائن</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 text-sm font-mono">{item.code}</td>
                    <td className="p-3 text-sm font-medium">{item.name}</td>
                    <td className="p-3 text-sm text-center">{item.prevDebit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center">{item.prevCredit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center">{item.periodDebit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center">{item.periodCredit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center font-bold">{item.afterDebit.toFixed(2)}</td>
                    <td className="p-3 text-sm text-center font-bold">{item.afterCredit.toFixed(2)}</td>
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
