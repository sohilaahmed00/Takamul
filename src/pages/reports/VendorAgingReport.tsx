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

const VendorAgingReport = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image
  const agingData = [
    { id: 1, company: 'string', name: 'string', less30: 0.00, range30_60: 0.00, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 },
    { id: 2, company: 'مورد', name: 'مورد', less30: 0.00, range30_60: 500.01, range60_90: 0.00, range90_120: 0.00, range120_150: 0.00, more150: 0.00 }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>البداية</span>
        <span>/</span>
        <span>التقارير</span>
        <span>/</span>
        <span className="text-[var(--primary)] font-medium">تقرير أعمار الديون للموردين</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-t-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Truck className="w-5 h-5" />
            <h1 className="text-xl font-bold">الموردين</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-[var(--primary)] border border-[var(--primary)]">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[var(--primary)] font-bold mb-6 text-center">الرجاء الضغط التقرير بغية التحقق من التقرير العملاء.</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <input
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
          <table className="w-full text-right border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="p-3 border border-[var(--primary-hover)]">الشركة</th>
                <th className="p-3 border border-[var(--primary-hover)]">اسم</th>
                <th className="p-3 border border-[var(--primary-hover)]">أقل من 30 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">من 30 الي 60 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">من 60 الي 90 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">من 90 الي 120 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">من 120 الي 150 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">أكبر من 150 يوم</th>
                <th className="p-3 border border-[var(--primary-hover)]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {agingData.map((data, index) => (
                <tr key={data.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.company}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.name}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.less30.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.range30_60.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.range60_90.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.range90_120.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.range120_150.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{data.more150.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm">
                    <button className="bg-[var(--primary)] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors">
                      عرض التقرير
                    </button>
                  </td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-100 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs" colSpan={2}></td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm">500.01</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
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
            <button className="px-4 py-2 bg-[var(--primary)] text-white border-l border-gray-300">1</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[var(--primary)] font-bold">
            عرض 1 إلى 2 من 2 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAgingReport;
