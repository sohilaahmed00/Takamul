import React, { useState } from 'react';
import { 
  Calculator, FileText, FileSpreadsheet, 
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

import { Input } from "@/components/ui/input";

type TabType = 'sales' | 'zero-sales' | 'non-zero-sales' | 'purchases' | 'zero-purchases' | 'non-zero-purchases';

export default function TaxReport() {
  const { direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const tabs = [
    { id: 'sales', name: 'المبيعات' },
    { id: 'zero-sales', name: 'المبيعات الصفرية' },
    { id: 'non-zero-sales', name: 'المبيعات الغير صفرية' },
    { id: 'purchases', name: 'المشتريات' },
    { id: 'zero-purchases', name: 'المشتريات الصفرية' },
    { id: 'non-zero-purchases', name: 'المشتريات الغير صفرية' },
  ];

  const renderSummaryCards = () => {
    let cards = [];
    if (activeTab === 'sales') {
      cards = [
        { title: 'اجمالي قيم المبيعات بدون ضريبة بعد الخصم', value: '0.00', color: 'bg-orange-600' },
        { title: 'اجمالي ضريبة الصنف بعد الخصم', value: '0.00', color: 'bg-[var(--primary)]' },
        { title: 'اجمالي الخصم', value: '0.00', color: 'bg-teal-500' },
      ];
    } else if (activeTab === 'purchases') {
      cards = [
        { title: 'إجمالي قيم المشتريات بدون ضريبة', value: '0.00', color: 'bg-orange-600' },
        { title: 'إجمالي ضريبة المشتريات', value: '0.00', color: 'bg-[var(--primary)]' },
        { title: 'اجمالي الخصم', value: '0.00', color: 'bg-teal-500' },
      ];
    } else {
      cards = [
        { title: activeTab.includes('sales') ? 'إجمالي قيم المبيعات بدون ضريبة' : 'إجمالي قيم المشتريات بدون ضريبة', value: '0', color: 'bg-orange-600' },
        { title: activeTab.includes('sales') ? 'اجمالي ضريبة الصنف' : 'إجمالي ضريبة المشتريات', value: '0', color: 'bg-[var(--primary)]' },
        { title: 'اجمالي الخصم', value: '0', color: 'bg-teal-500' },
      ];
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card, idx) => (
          <div key={idx} className={cn("p-6 rounded-lg shadow-sm text-white flex flex-col items-center justify-center text-center space-y-2", card.color)}>
            <div className="text-sm font-bold">{card.title}</div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    const commonHeaderClass = "px-2 py-3 border border-[var(--primary-hover)] font-bold text-xs whitespace-nowrap";
    const commonCellClass = "px-2 py-2 border border-gray-200 dark:border-gray-700 text-xs text-center";

    if (activeTab === 'sales') {
      return (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[var(--primary)] text-white">
              <th className={commonHeaderClass}>رقم الفاتورة</th>
              <th className={commonHeaderClass}>التاريخ</th>
              <th className={commonHeaderClass}>الرقم المرجعي</th>
              <th className={commonHeaderClass}>الحالة</th>
              <th className={commonHeaderClass}>الفرع</th>
              <th className={commonHeaderClass}>الاجمالي بدون ضريبة بعد الخصم</th>
              <th className={commonHeaderClass}>ضريبة الصنف</th>
              <th className={commonHeaderClass}>الخصم</th>
              <th className={commonHeaderClass}>المجموع الكلي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className="px-3 py-10 text-center font-bold text-gray-500 dark:text-gray-400">لا توجد بيانات في الجدول</td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
            <tr>
              <td colSpan={5} className={commonCellClass}></td>
              <td className={commonCellClass}>0.00</td>
              <td className={commonCellClass}>0.00</td>
              <td className={commonCellClass}>0.00</td>
              <td className={commonCellClass}>0.00</td>
            </tr>
          </tfoot>
        </table>
      );
    }

    if (activeTab === 'purchases') {
      return (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[var(--primary)] text-white">
              <th className={commonHeaderClass}>رقم الفاتورة</th>
              <th className={commonHeaderClass}>التاريخ</th>
              <th className={commonHeaderClass}>الرقم المرجعي</th>
              <th className={commonHeaderClass}>الحالة</th>
              <th className={commonHeaderClass}>الفرع</th>
              <th className={commonHeaderClass}>مورد</th>
              <th className={commonHeaderClass}>الرقم الضريبي</th>
              <th className={commonHeaderClass}>الاجمالي بدون ضريبة</th>
              <th className={commonHeaderClass}>ضريبة الصنف</th>
              <th className={commonHeaderClass}>المجموع الكلي</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} className="px-3 py-10 text-center font-bold text-gray-500 dark:text-gray-400">لا توجد بيانات في الجدول</td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
            <tr>
              <td colSpan={7} className={commonCellClass}></td>
              <td className={commonCellClass}>0.00</td>
              <td className={commonCellClass}>0.00</td>
              <td className={commonCellClass}>0.00</td>
            </tr>
          </tfoot>
        </table>
      );
    }

    // For zero and non-zero sales/purchases
    return (
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="bg-[var(--primary)] text-white">
            <th className={commonHeaderClass}>رقم الفاتورة</th>
            <th className={commonHeaderClass}>التاريخ</th>
            <th className={commonHeaderClass}>الرقم المرجعي</th>
            <th className={commonHeaderClass}>كود الصنف</th>
            <th className={commonHeaderClass}>اسم الصنف</th>
            <th className={commonHeaderClass}>كميات الأصناف</th>
            <th className={commonHeaderClass}>السعر قبل الضريبة</th>
            <th className={commonHeaderClass}>ضريبة</th>
            <th className={commonHeaderClass}>السعر بعد الضريبة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={9} className="px-3 py-10 text-center font-bold text-gray-500 dark:text-gray-400">لا توجد بيانات في الجدول</td>
          </tr>
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
          <tr>
            <td colSpan={5} className={commonCellClass}></td>
            <td className={commonCellClass}>0.00</td>
            <td className={commonCellClass}>0.00</td>
            <td className={commonCellClass}>0.00</td>
            <td className={commonCellClass}>0.00</td>
          </tr>
        </tfoot>
      </table>
    );
  };

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-neutral-950 min-h-screen" dir={direction}>
      {/* Breadcrumbs */}
      <div className="flex items-center justify-end gap-2 text-xs text-[var(--primary)] font-bold">
        <span>تقرير الضرائب</span>
        <span>/</span>
        <span>التقارير</span>
        <span>/</span>
        <span>البداية</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-end gap-1 border-b border-gray-200 dark:border-neutral-800">
        {tabs.reverse().map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-4 py-2 text-sm font-bold transition-colors border-t border-x rounded-t-lg -mb-px",
              activeTab === tab.id 
                ? "bg-white dark:bg-neutral-900 text-[var(--primary)] border-gray-200 dark:border-neutral-800" 
                : "bg-gray-100 dark:bg-neutral-950 text-gray-600 dark:text-neutral-400 border-transparent hover:bg-gray-200 dark:hover:bg-neutral-800"
            )}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Report Container */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="text-[var(--primary)]" size={20} />
            <h1 className="text-lg font-bold text-[var(--primary)]">
              {activeTab === 'sales' && 'تقرير ضرائب المبيعات'}
              {activeTab === 'zero-sales' && 'تقرير المبيعات الصفرية'}
              {activeTab === 'non-zero-sales' && 'تقرير المبيعات الغير صفرية'}
              {activeTab === 'purchases' && 'تقرير ضرائب المشتريات'}
              {activeTab === 'zero-purchases' && 'تقرير المشتريات الصفرية'}
              {activeTab === 'non-zero-purchases' && 'تقرير المشتريات الغير صفرية'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"><FileText size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
          </div>
        </div>

        <div className="text-[var(--primary)] text-sm font-medium text-right mb-6">يرجى تخصيص التقرير أدناه</div>

        {/* Summary Cards */}
        {renderSummaryCards()}

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">اظهار</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-neutral-800"
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
              className="border border-gray-300 dark:border-neutral-700 rounded px-3 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-neutral-800 w-full md:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800">
          {renderTable()}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 0 إلى 0 من 0 سجلات
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">التالي &gt;</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
