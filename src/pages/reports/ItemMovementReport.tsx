import React, { useState } from 'react';
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp, RefreshCw, ShoppingCart, DollarSign, Settings2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type Tab = 'total' | 'sales' | 'purchases' | 'adjustments';

export default function ItemMovementReport() {
  const { direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const tabs = [
    { id: 'total', label: 'اجمالي الحركات', icon: <RefreshCw size={16} /> },
    { id: 'sales', label: 'المبيعات', icon: <DollarSign size={16} /> },
    { id: 'purchases', label: 'المشتريات', icon: <ShoppingCart size={16} /> },
    { id: 'adjustments', label: 'تقرير تعديلات الكميات', icon: <Settings2 size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'total':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">شراء</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">مباعة</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تقرير كميات المخزون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                <tr>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00 (0)</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00 (0)</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00 (0)</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      case 'sales':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود العميل</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم العميل</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كمية</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">البونص</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">السعر</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                <tr>
                  <td colSpan={4} className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                  <td colSpan={2} className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      case 'purchases':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">مورد</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كميات الأصناف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تكلفة</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center font-bold text-gray-500">لا توجد بيانات في الجدول</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                <tr>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[(yyyy-mm-dd) التاريخ]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الرقم المرجعي]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[مورد]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      case 'adjustments':
        const adjData = [
          { date: '12:25:00 29/01/2026', ref: 'Up0138', branch: 'نشاط الصالون', code: '64402228', name: 'تنظيف بشرة', qty: '1', cost: '0', total: '0' },
          { date: '22:21:00 25/01/2026', ref: 'Up0139', branch: 'مغسلة سيارات', code: '13032304', name: 'بندق', qty: '2', cost: '0', total: '0' },
          { date: '12:39:00 25/01/2026', ref: 'Up0139', branch: 'مغسلة سيارات', code: '75448610', name: 'قهوه تركيه غامق', qty: '20', cost: '0', total: '0' },
          { date: '12:24:00 25/01/2026', ref: 'Up0139', branch: 'مغسلة سيارات', code: '6287008230576', name: 'مويا ربتة', qty: '1', cost: '0', total: '0' },
          { date: '01:47:00 25/01/2026', ref: 'Up0137', branch: 'مغسلة سيارات', code: '13032304', name: 'بندق', qty: '5', cost: '0', total: '0' },
          { date: '12:37:00 31/12/2025', ref: 'Up0136', branch: 'نشاط سوبرماركت', code: '21212121212121', name: 'مياه', qty: '100', cost: '50', total: '5000' },
          { date: '17:03:00 25/12/2025', ref: 'Up0135', branch: 'مغسلة سيارات', code: '6972253511920', name: 'حلاقة ذقن', qty: '10', cost: '0', total: '0' },
          { date: '13:17:00 10/12/2025', ref: 'Up0133', branch: 'مغسلة سيارات', code: '', name: '', qty: '0.1', cost: '0', total: '0' },
        ];
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">التاريخ</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الرقم المرجعي</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">الفرع</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كود الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">اسم الصنف</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">كمية</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">تكلفة</th>
                  <th className="px-3 py-2 border border-[var(--primary-hover)] font-bold">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {adjData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.date}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.ref}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.branch}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.code}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 font-medium">{row.name}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.qty}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.cost}</td>
                    <td className="px-3 py-2 border border-gray-200 dark:border-gray-700">{row.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                <tr>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[(yyyy-mm-dd) التاريخ]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الرقم المرجعي]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[الفرع]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[كود الصنف]</td>
                  <td className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-400">[اسم الصنف]</td>
                  <td colSpan={3} className="px-3 py-2 border border-gray-200 dark:border-gray-700"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Tabs */}
      <div className="flex items-center justify-end gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-t-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-all",
              activeTab === tab.id 
                ? "bg-white dark:bg-gray-700 text-[var(--primary)] shadow-sm" 
                : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
            )}
          >
            {tab.label}
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-[var(--primary)]" size={20} />
            <h1 className="text-lg font-bold text-[var(--primary)]">تقرير حركة الأصناف</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronDown size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><ChevronUp size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileSpreadsheet size={16} className="text-[var(--primary)]" /></button>
            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-[var(--primary)]" /></button>
          </div>
        </div>

        <div className="text-[var(--primary)] text-sm font-medium text-right">يرجى تخصيص التقرير أدناه</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none focus:border-[var(--primary)] dark:bg-gray-700 w-full md:w-64"
            />
          </div>
        </div>

        {renderContent()}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-sm font-bold text-[var(--primary)]">
            {activeTab === 'adjustments' ? 'عرض 1 إلى 10 من 12 سجلات' : 'عرض 0 إلى 0 من 0 سجلات'}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">التالي &gt;</button>
            {activeTab === 'adjustments' && <button className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">2</button>}
            <button className="px-2 py-1 bg-[var(--primary)] text-white rounded text-xs font-bold">1</button>
            <button className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-400 cursor-not-allowed">&lt; سابق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
