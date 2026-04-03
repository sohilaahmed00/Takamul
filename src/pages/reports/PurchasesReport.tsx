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
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const PurchasesReport = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data based on the image
  const purchases = [
    {
      id: 1,
      date: '18:18:00 07/01/2026',
      reference: '2533',
      branch: 'مغسلة سيارات',
      supplier: 'مورد',
      taxNumber: '',
      total: 500.01,
      paid: 0.00,
      balance: 500.01,
      status: 'تم الاستلام'
    },
    {
      id: 2,
      date: '13:34:00 10/12/2025',
      reference: 'حك',
      branch: 'مغسلة سيارات',
      supplier: 'مورد',
      taxNumber: '',
      total: 517.50,
      paid: 517.50,
      balance: 0.00,
      status: 'تم الاستلام'
    },
    {
      id: 3,
      date: '13:18:00 10/12/2025',
      reference: '4774',
      branch: 'مغسلة سيارات',
      supplier: 'مورد',
      taxNumber: '',
      total: 0.00,
      paid: 0.00,
      balance: 0.00,
      status: 'تم الاستلام'
    }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <Star className="w-5 h-5 fill-current" />
          <h1 className="text-xl font-bold">تقرير عن المشتريات</h1>
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
            <input
              type="text"
              placeholder={t("search_label")}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[var(--primary)] font-bold">اظهار</span>
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
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[var(--table-header)] text-white">
                <th className="p-3 border border-white/10">التاريخ</th>
                <th className="p-3 border border-white/10">الرقم المرجعي</th>
                <th className="p-3 border border-white/10">الفرع</th>
                <th className="p-3 border border-white/10">مورد</th>
                <th className="p-3 border border-white/10">الرقم الضريبي</th>
                <th className="p-3 border border-white/10">المجموع الكلي</th>
                <th className="p-3 border border-white/10">مدفوع</th>
                <th className="p-3 border border-white/10">الرصيد الحالي</th>
                <th className="p-3 border border-white/10">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={purchase.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-yellow-50')}>
                  <td className="p-3 border border-gray-200 text-sm">{purchase.date}</td>
                  <td className="p-3 border border-gray-200 text-sm">{purchase.reference}</td>
                  <td className="p-3 border border-gray-200 text-sm">{purchase.branch}</td>
                  <td className="p-3 border border-gray-200 text-sm">{purchase.supplier}</td>
                  <td className="p-3 border border-gray-200 text-sm">{purchase.taxNumber}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{purchase.total.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{purchase.paid.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{purchase.balance.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200">
                    <span className="bg-[var(--primary)] text-white px-2 py-1 rounded text-xs font-bold">
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-50 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs">[التاريخ (yyyy-mm-dd)]</td>
                <td className="p-3 border border-gray-200 text-xs">[رقم المرجع]</td>
                <td className="p-3 border border-gray-200 text-xs">[الفرع]</td>
                <td className="p-3 border border-gray-200 text-xs">[مورد]</td>
                <td className="p-3 border border-gray-200 text-xs">[الرقم الضريبي]</td>
                <td className="p-3 border border-gray-200 text-sm">1,017.51</td>
                <td className="p-3 border border-gray-200 text-sm">517.50</td>
                <td className="p-3 border border-gray-200 text-sm">500.01</td>
                <td className="p-3 border border-gray-200 text-xs">[الحالة]</td>
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
            عرض 1 إلى 3 من 3 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesReport;
