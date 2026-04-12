import React, { useState } from 'react';
import {
  Search,
  FileText,
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

const PaymentsReport = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image (empty table)
  const payments: any[] = [];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <CreditCard className="w-5 h-5" />
          <h1 className="text-xl font-bold">تقرير عن المدفوعات</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
            <FileText className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
            <FileSpreadsheet className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border-x border-gray-200">
        <p className="text-[var(--primary)] font-medium mb-4">يرجى تخصيص التقرير أدناه</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder={t("search_label")}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--primary)]">اظهار</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-right border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="p-3 border border-[var(--primary-hover)]">التاريخ</th>
                <th className="p-3 border border-[var(--primary-hover)]">رقم المرجع لعمليات الدفع</th>
                <th className="p-3 border border-[var(--primary-hover)]">رقم المرجع لعمليات البيع</th>
                <th className="p-3 border border-[var(--primary-hover)]">رقم المرجع لعمليات الشراء</th>
                <th className="p-3 border border-[var(--primary-hover)]">نوع الدفع</th>
                <th className="p-3 border border-[var(--primary-hover)]">المدفوع</th>
                <th className="p-3 border border-[var(--primary-hover)]">نوع</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr key={payment.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-[var(--primary)]/5')}>
                    <td className="p-3 border border-gray-200 text-sm">{payment.date}</td>
                    <td className="p-3 border border-gray-200 text-sm">{payment.paymentRef}</td>
                    <td className="p-3 border border-gray-200 text-sm">{payment.salesRef}</td>
                    <td className="p-3 border border-gray-200 text-sm">{payment.purchaseRef}</td>
                    <td className="p-3 border border-gray-200 text-sm">{payment.paymentType}</td>
                    <td className="p-3 border border-gray-200 text-sm font-bold">{payment.amount.toFixed(2)}</td>
                    <td className="p-3 border border-gray-200 text-sm">{payment.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--primary)] font-bold">
                    لا توجد بيانات في الجدول
                  </td>
                </tr>
              )}
              {/* Footer Row */}
              <tr className="bg-gray-100 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs">[(yyyy-mm-dd) التاريخ]</td>
                <td className="p-3 border border-gray-200 text-xs">[رقم المرجع لعمليات الدفع]</td>
                <td className="p-3 border border-gray-200 text-xs">[رقم المرجع لعمليات البيع]</td>
                <td className="p-3 border border-gray-200 text-xs">[رقم المرجع لعمليات الشراء]</td>
                <td className="p-3 border border-gray-200 text-xs">[نوع الدفع]</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-xs">[نوع]</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600 flex items-center gap-1">
              <ArrowRight className="w-4 h-4" /> التالي
            </button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[var(--primary)] font-bold">
            عرض 0 إلى 0 من 0 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsReport;
