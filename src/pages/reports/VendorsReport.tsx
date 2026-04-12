import React, { useState } from 'react';
import {
  Search,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

const VendorsReport = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image
  const vendors = [
    { id: 1, company: 'string', name: 'string', phone: '201555544545', email: 'user@example.com', totalPurchases: 0.00, totalAmount: 0.22, paid: 0.00, accountingEntries: 0.00, balance: 0.00 },
    { id: 2, company: 'مورد', name: 'مورد', phone: '', email: '', totalPurchases: 3.00, totalAmount: 1017.51, paid: 517.50, accountingEntries: 0.00, balance: 500.01 }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>البداية</span>
        <span>/</span>
        <span>التقارير</span>
        <span>/</span>
        <span className="text-emerald-800 font-medium">تقرير الموردين</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-t-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-emerald-800">
            <Truck className="w-5 h-5" />
            <h1 className="text-xl font-bold">الموردين</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-emerald-800 font-bold mb-6 text-center">الرجاء الضغط التقرير بغية التحقق من التقرير المورد.</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder={t("search_label")}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600 text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-800 font-bold">اظهار</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
          <table className="w-full text-right border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 border border-emerald-500 text-center">الشركة</th>
                <th className="p-3 border border-emerald-500 text-center">اسم</th>
                <th className="p-3 border border-emerald-500 text-center">هاتف</th>
                <th className="p-3 border border-emerald-500 text-center">عنوان البريد الإلكتروني</th>
                <th className="p-3 border border-emerald-500 text-center">مجموع المشتريات</th>
                <th className="p-3 border border-emerald-500 text-center">المجموع الكلي</th>
                <th className="p-3 border border-emerald-500 text-center">مدفوع</th>
                <th className="p-3 border border-emerald-500 text-center">القيود المحاسبية</th>
                <th className="p-3 border border-emerald-500 text-center">الرصيد الحالي</th>
                <th className="p-3 border border-emerald-500 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={vendor.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.company}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.name}</td>
                  <td className="p-3 border border-gray-200 text-sm">{vendor.phone}</td>
                  <td className="p-3 border border-gray-200 text-sm">{vendor.email}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.totalPurchases.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.totalAmount.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.paid.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{vendor.accountingEntries.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold text-emerald-600">{vendor.balance.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm">
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-emerald-700 transition-colors">
                      عرض التقرير
                    </button>
                  </td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-100 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs">[الشركة]</td>
                <td className="p-3 border border-gray-200 text-xs">[اسم]</td>
                <td className="p-3 border border-gray-200 text-xs">[هاتف]</td>
                <td className="p-3 border border-gray-200 text-xs">[عنوان البريد الإلكتروني]</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm">1,017.73</td>
                <td className="p-3 border border-gray-200 text-sm">517.50</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm text-emerald-600">0.00</td>
                <td className="p-3 border border-gray-200 text-xs">الإجراءات</td>
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
            <button className="px-4 py-2 bg-emerald-600 text-white border-l border-gray-300">1</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-emerald-800 font-bold">
            عرض 1 إلى 2 من 2 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsReport;
