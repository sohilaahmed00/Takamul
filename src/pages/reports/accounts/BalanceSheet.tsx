import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Printer, Share2, Search } from 'lucide-react';

export default function BalanceSheet() {
  const { t, direction } = useLanguage();
  
  const data = [
    { code: '1', name: 'الأصول', debit: 0, credit: 0, balance: 0 },
    { code: '11', name: 'الأصول المتداولة', debit: 0, credit: 0, balance: 0 },
    { code: '1101', name: 'نقدية بالصناديق', debit: 0, credit: 0, balance: 0 },
    { code: '110101', name: 'صندوق رئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '1102', name: 'نقدية بالبنوك', debit: 0, credit: 0, balance: 0 },
    { code: '110201', name: 'البنك الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '110202', name: 'حساب نقاط البيع', debit: 0, credit: 0, balance: 0 },
    { code: '1103', name: 'عهد', debit: 0, credit: 0, balance: 0 },
    { code: '110301', name: 'العهد المستديمة', debit: 0, credit: 0, balance: 0 },
    { code: '110302', name: 'العهد المؤقتة', debit: 0, credit: 0, balance: 0 },
    { code: '11030201', name: 'عهدة الأجهزة التقنية', debit: 0, credit: 0, balance: 0 },
    { code: '1104', name: 'شيكات تحت التحصيل', debit: 0, credit: 0, balance: 0 },
    { code: '1105', name: 'شيكات مرتدة', debit: 0, credit: 0, balance: 0 },
    { code: '1106', name: 'أوراق قبض', debit: 0, credit: 0, balance: 0 },
    { code: '1107', name: 'العملاء', debit: 0, credit: 0, balance: 0 },
    { code: '1108', name: 'المخزون', debit: 0, credit: 0, balance: 0 },
    { code: '110801', name: 'المخزون الرئيسي', debit: 0, credit: 0, balance: 0 },
    { code: '1109', name: 'الاعتمادات المستندية', debit: 0, credit: 0, balance: 0 },
    { code: '1110', name: 'ذمم العاملين', debit: 0, credit: 0, balance: 0 },
    { code: '1111', name: 'المدينون', debit: 0, credit: 0, balance: 0 },
    { code: '1112', name: 'الأرصدة المدينة الأخرى', debit: 0, credit: 0, balance: 0 },
    { code: '111201', name: 'المصروفات المدفوعة مقدما', debit: 0, credit: 0, balance: 0 },
    { code: '11120101', name: 'إيجارات مدفوعة مقدماً', debit: 0, credit: 0, balance: 0 },
    { code: '111202', name: 'إيرادات مستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '111203', name: 'ضريبة القيمة المضافة على المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '12', name: 'الأصول غير متداولة', debit: 0, credit: 0, balance: 0 },
    { code: '1201', name: 'السيارات بالصافي', debit: 0, credit: 0, balance: 0 },
    { code: '120101', name: 'السيارات', debit: 0, credit: 0, balance: 0 },
    { code: '120102', name: 'مجمع اهلاك السيارات', debit: 0, credit: 0, balance: 0 },
    { code: '1202', name: 'الأجهزة الكهربائية بالصافي', debit: 0, credit: 0, balance: 0 },
    { code: '120201', name: 'الأجهزة الكهربائية', debit: 0, credit: 0, balance: 0 },
    { code: '120202', name: 'مجمع اهلاك الأجهزة الكهربائية', debit: 0, credit: 0, balance: 0 },
    { code: '13', name: 'أصول أخرى', debit: 0, credit: 0, balance: 0 },
    { code: '14', name: 'مجمع الإهلاك', debit: 0, credit: 0, balance: 0 },
    { code: '2', name: 'الخصوم', debit: 0, credit: 0, balance: 0 },
    { code: '21', name: 'الخصوم المتداولة', debit: 0, credit: 0, balance: 0 },
    { code: '2101', name: 'الموردين', debit: 0, credit: 0, balance: 0 },
    { code: '2102', name: 'الدائنون', debit: 0, credit: 0, balance: 0 },
    { code: '2103', name: 'الأرصدة الدائنة الأخرى', debit: 0, credit: 0, balance: 0 },
    { code: '210301', name: 'مستحقات الموظفين', debit: 0, credit: 0, balance: 0 },
    { code: '21030101', name: 'الرواتب المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010101', name: 'رواتب الفنيين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010102', name: 'رواتب الإداريين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010103', name: 'رواتب العمال المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '21030102', name: 'العمولات المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010201', name: 'عمولة الفنيين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010202', name: 'عمولة المحصلين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '21030103', name: 'بدلات الأجازة المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010301', name: 'بدلات أجازة الفنيين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '2103010302', name: 'بدلات أجازة الإداريين المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '210302', name: 'الإيجارات المستحقة', debit: 0, credit: 0, balance: 0 },
    { code: '210303', name: 'ضريبة القيمة المضافة على المشتريات', debit: 0, credit: 0, balance: 0 },
    { code: '210304', name: 'ضريبة القيمة المضافة المستحقة (تسويات ضريبية)', debit: 0, credit: 0, balance: 0 },
    { code: '3', name: 'رأس المال وحقوق الملكية', debit: 0, credit: 0, balance: 0 },
    { code: '31', name: 'رأس المال الإبتدائي', debit: 0, credit: 0, balance: 0 },
    { code: '3101', name: 'رأس المال المدفوع', debit: 0, credit: 0, balance: 0 },
    { code: '310101', name: 'رأس مال صاحب المؤسسة', debit: 0, credit: 0, balance: 0 },
    { code: '32', name: 'جاري الشركاء', debit: 0, credit: 0, balance: 0 },
    { code: '33', name: 'حساب الربح أو الخسارة', debit: 0, credit: 0, balance: 0 },
    { code: '3301', name: 'حساب الربح أو الخسارة العام الحالي', debit: 0, credit: 0, balance: 0 },
    { code: '330102', name: 'معادلة الربح في المبيعات', debit: 0, credit: 0, balance: 0 },
    { code: '3302', name: 'حساب الربح أو الخسارة سنوات سابقة', debit: 0, credit: 0, balance: 0 },
    { code: '34', name: 'الحساب الوسيط', debit: 0, credit: 0, balance: 0 },
    { code: '3401', name: 'حساب وسيط 1', debit: 0, credit: 0, balance: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">الميزانية العمومية</h1>
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
                {data?.map((item, index) => (
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
