import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, Printer, Share2, Search, Calendar, Users, UserPlus, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Input } from "@/components/ui/input";

export default function SubsidiaryLedger() {
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState('movements');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const movementsData = [
    { code: '1107', name: 'العملاء', prevDebit: 0, prevCredit: 0, periodDebit: 18335.60, periodCredit: 19085.00, afterDebit: 0, afterCredit: 749.40 },
    { code: '2101', name: 'الموردين', prevDebit: 0, prevCredit: 0, periodDebit: 517.50, periodCredit: 1017.51, afterDebit: 0, afterCredit: 500.01 },
  ];

  const customersData = [
    { code: '1', name: 'عميل افتراضي - شخص عام', prevBalance: 0, debit: 15135.60, credit: 14885.00, currentBalance: 250.60 },
    { code: '103', name: 'test010', prevBalance: 0, debit: 3.00, credit: 0, currentBalance: 3.00 },
    { code: '104', name: 'test', prevBalance: 0, debit: 88.00, credit: 88.00, currentBalance: 0 },
    { code: '105', name: 'new55', prevBalance: 0, debit: 323.00, credit: 315.00, currentBalance: 8.00 },
    { code: '106', name: 'محمد', prevBalance: 0, debit: 3066.00, credit: 3066.00, currentBalance: 0 },
    { code: '108', name: 'محمددددد - محمددددد', prevBalance: 0, debit: 270.00, credit: 270.00, currentBalance: 0 },
    { code: '109', name: 'تكامل البيانات - تكامل البيانات', prevBalance: 0, debit: 0, credit: 0, currentBalance: 0 },
    { code: '110', name: '123', prevBalance: 0, debit: 1550.00, credit: 1400.00, currentBalance: 150.00 },
  ];

  const suppliersData = [
    { code: '0', name: 'مورد - مورد', prevBalance: 0, debit: 517.50, credit: 1017.51, currentBalance: -500.01 },
    { code: '0', name: 'string - string', prevBalance: 0, debit: 0, credit: 0, currentBalance: 0 },
  ];

  const tabs = [
    { id: 'movements', name: 'اجمالي الحركات', icon: <Activity size={18} /> },
    { id: 'customers', name: 'العملاء', icon: <Users size={18} /> },
    { id: 'suppliers', name: 'الموردين', icon: <UserPlus size={18} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <FileText size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">كشف حساب استاذ مساعد</h1>
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
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تاريخ البداية</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
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
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95">
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
              <Input
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
            {activeTab === 'movements' && (
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
                  {movementsData.map((item, index) => (
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
            )}

            {activeTab === 'customers' && (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[var(--primary)] text-white">
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">كود</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">اسم</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">رصيد ما قبل</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">مدين</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">دائن</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">الرصيد الحالي</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">الاجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {customersData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-3 text-sm font-mono">{item.code}</td>
                      <td className="p-3 text-sm font-medium">{item.name}</td>
                      <td className="p-3 text-sm text-center">{item.prevBalance.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">{item.debit.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">{item.credit.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center font-bold">{item.currentBalance.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">
                        <button className="bg-[var(--primary)] text-white px-3 py-1 rounded text-xs hover:bg-[var(--primary-hover)] transition-colors">عرض التقرير</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'suppliers' && (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[var(--primary)] text-white">
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">كود</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">اسم</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">رصيد ما قبل</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">مدين</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">دائن</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">الرصيد الحالي</th>
                    <th className="p-3 border border-[var(--primary-hover)] font-bold">الاجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-3 text-sm font-mono">{item.code}</td>
                      <td className="p-3 text-sm font-medium">{item.name}</td>
                      <td className="p-3 text-sm text-center">{item.prevBalance.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">{item.debit.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">{item.credit.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center font-bold">{item.currentBalance.toFixed(2)}</td>
                      <td className="p-3 text-sm text-center">
                        <button className="bg-[var(--primary)] text-white px-3 py-1 rounded text-xs hover:bg-[var(--primary-hover)] transition-colors">عرض التقرير</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">عرض 1 إلى {activeTab === 'movements' ? movementsData.length : activeTab === 'customers' ? customersData.length : suppliersData.length} سجلات</span>
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
