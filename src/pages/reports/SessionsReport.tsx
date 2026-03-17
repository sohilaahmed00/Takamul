import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Search, Download, Printer, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Pagination from '@/components/Pagination';

export default function SessionsReport() {
  const { t, direction } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesCount, setEntriesCount] = useState(10);

  const data = [
    { id: '6', invoiceId: '355', startDate: '2026-02-10 19:36:22', endDate: '2026-02-10 19:39:54', room: 'HHHHH', customer: 'test', status: 'منتهية', amount: '80.00' },
    { id: '5', invoiceId: '0', startDate: '2026-01-01 14:48:36', endDate: '2026-01-03 02:00:00', room: 'غرفة 2', customer: 'new55', status: 'نشطة', amount: '0.00' },
    { id: '4', invoiceId: '257', startDate: '2026-01-01 14:36:40', endDate: '2026-01-04 13:40:37', room: 'غرفة 1', customer: 'محمد', status: 'منتهية', amount: '235.00' },
    { id: '3', invoiceId: '254', startDate: '2026-01-01 14:33:00', endDate: '2026-01-01 14:35:24', room: 'غرفة 1', customer: 'محمد', status: 'منتهية', amount: '200.00' },
    { id: '2', invoiceId: '253', startDate: '2026-01-01 12:35:30', endDate: '2026-01-01 12:36:03', room: 'غرفة 1', customer: 'new55', status: 'منتهية', amount: '65.00' },
    { id: '1', invoiceId: '252', startDate: '2025-12-30 13:41:25', endDate: '2026-01-01 12:34:53', room: 'غرفة 2', customer: 'محمد', status: 'منتهية', amount: '2,400.00' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900" dir={direction}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <Calendar size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">تقرير الجلسات</h1>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">إظهار</span>
                <select
                  value={entriesCount}
                  onChange={(e) => setEntriesCount(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]",
                  direction === 'rtl' ? "pr-10 pl-4" : "pl-10 pr-4"
                )}
              />
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 text-gray-400",
                direction === 'rtl' ? "right-3" : "left-3"
              )} size={18} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[var(--table-header)] text-white">
                <tr>
                  <th className="px-4 py-3 font-bold">رقم الجلسة</th>
                  <th className="px-4 py-3 font-bold">رقم الفاتورة</th>
                  <th className="px-4 py-3 font-bold">تاريخ البداية</th>
                  <th className="px-4 py-3 font-bold">تاريخ النهاية</th>
                  <th className="px-4 py-3 font-bold">الغرفة</th>
                  <th className="px-4 py-3 font-bold">العميل</th>
                  <th className="px-4 py-3 font-bold">الحالة</th>
                  <th className="px-4 py-3 font-bold">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.id}</td>
                    <td className="px-4 py-3">{row.invoiceId}</td>
                    <td className="px-4 py-3 text-xs">{row.startDate}</td>
                    <td className="px-4 py-3 text-xs">{row.endDate}</td>
                    <td className="px-4 py-3">{row.room}</td>
                    <td className="px-4 py-3">{row.customer}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        "bg-[var(--primary)]/10 text-[var(--primary)]"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900 font-bold">
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-left">0.00</td>
                  <td className="px-4 py-3">0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={1}
              totalPages={1}
              totalItems={data.length}
              itemsPerPage={entriesCount}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
