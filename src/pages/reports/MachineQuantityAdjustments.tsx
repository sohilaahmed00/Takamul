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
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

import { Input } from "@/components/ui/input";

const MachineQuantityAdjustments = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image
  const adjustments = [
    { id: 1, date: '12:25:00 29/01/2026', reference: 'Up0138', branch: 'نشاط الصالون', user: 'admin', notes: '', items: 'تنظيف بشرة', quantity: 1.0000 },
    { id: 2, date: '22:21:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: 'بندق', quantity: -2.0000 },
    { id: 3, date: '12:39:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: '', quantity: 20.0000 },
    { id: 4, date: '12:39:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: 'قهوه تركيه غامق', quantity: 20.0000 },
    { id: 5, date: '12:24:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: '', quantity: 1.0000 },
    { id: 6, date: '12:24:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: 'مويا ربتة', quantity: 1.0000 },
    { id: 7, date: '01:47:00 25/01/2026', reference: 'Up0137', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: 'بندق', quantity: 5.0000 },
    { id: 8, date: '12:37:00 31/12/2025', reference: 'Up0136', branch: 'نشاط سوبر ماركت', user: 'admin', notes: '<p>سند جرد</p>', items: 'مياه', quantity: 100.0000 },
    { id: 9, date: '17:03:00 25/12/2025', reference: 'Up0135', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: 'حلاقة ذقن', quantity: 10.0000 },
    { id: 10, date: '13:17:00 10/12/2025', reference: 'Up0133', branch: 'مغسلة سيارات', user: 'admin', notes: '', items: '', quantity: 1.0000 }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <Filter className="w-5 h-5" />
          <h1 className="text-xl font-bold">التعديلات الكمية للماكينة</h1>
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
        <p className="text-[var(--primary)] font-medium mb-4">الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder={t("search_label")}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="p-3 border border-[var(--primary-hover)]">التاريخ</th>
                <th className="p-3 border border-[var(--primary-hover)]">الرقم المرجعي</th>
                <th className="p-3 border border-[var(--primary-hover)]">الفرع</th>
                <th className="p-3 border border-[var(--primary-hover)]">مدخل البيانات</th>
                <th className="p-3 border border-[var(--primary-hover)]">مذكرة</th>
                <th className="p-3 border border-[var(--primary-hover)]">الأصناف</th>
                <th className="p-3 border border-[var(--primary-hover)]">كمية</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adj, index) => (
                <tr key={adj.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-[var(--primary)]/5')}>
                  <td className="p-3 border border-gray-200 text-sm">{adj.date}</td>
                  <td className="p-3 border border-gray-200 text-sm">{adj.reference}</td>
                  <td className="p-3 border border-gray-200 text-sm">{adj.branch}</td>
                  <td className="p-3 border border-gray-200 text-sm">{adj.user}</td>
                  <td className="p-3 border border-gray-200 text-sm" dangerouslySetInnerHTML={{ __html: adj.notes }} />
                  <td className="p-3 border border-gray-200 text-sm">{adj.items}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{adj.quantity.toFixed(4)}</td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-50 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs">[التاريخ (yyyy-mm-dd)]</td>
                <td className="p-3 border border-gray-200 text-xs">[الرقم المرجعي]</td>
                <td className="p-3 border border-gray-200 text-xs">[الفرع]</td>
                <td className="p-3 border border-gray-200 text-xs">[مدخل البيانات]</td>
                <td className="p-3 border border-gray-200 text-xs">[ملاحظة]</td>
                <td className="p-3 border border-gray-200 text-sm">الأصناف</td>
                <td className="p-3 border border-gray-200 text-sm">0.00</td>
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
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600">2</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[var(--primary)] font-bold">
            عرض 1 إلى 10 من 12 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineQuantityAdjustments;
