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
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const ShiftsReport = () => {
  const { dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on the image
  const shifts = [
    { id: 59, openTime: '16:54:29 28/02/2026', closeTime: '', user: 'market market mtawfik12b@gmail.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 58, openTime: '14:59:42 31/01/2026', closeTime: '', user: 'admin ds@hotmail.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 57, openTime: '19:20:59 30/01/2026', closeTime: '', user: 'salon salon info11@posit2030.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 56, openTime: '00:37:24 25/01/2026', closeTime: '', user: 'rest rest mmmmmmm@gmail.com', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 55, openTime: '20:22:18 21/01/2026', closeTime: '02:34:33 24/01/2026', user: 'salon salon info11@posit2030.com', cash: 0.00, network: 3.0000, bank: 0.0000, total: 105.00, notes: '' },
    { id: 54, openTime: '16:04:23 18/01/2026', closeTime: '14:59:31 31/01/2026', user: 'admin ds@hotmail.com', cash: 0.00, network: 3.0000, bank: 0.0000, total: 16.00, notes: '' },
    { id: 53, openTime: '18:34:02 13/01/2026', closeTime: '', user: '', cash: 0.00, network: 0.00, bank: 0.00, total: 0.00, notes: '' },
    { id: 52, openTime: '23:24:52 10/01/2026', closeTime: '02:31:35 24/01/2026', user: 'rest rest mmmmmmm@gmail.com', cash: 100.00, network: 0.0000, bank: 0.0000, total: 378.00, notes: '' },
    { id: 51, openTime: '23:10:47 10/01/2026', closeTime: '14:34:39 18/01/2026', user: 'admin ds@hotmail.com', cash: 0.00, network: 14.0000, bank: 0.0000, total: 30.00, notes: '' },
    { id: 50, openTime: '23:08:11 10/01/2026', closeTime: '23:09:05 10/01/2026', user: 'rest rest mmmmmmm@gmail.com', cash: 10.00, network: 0.0000, bank: 0.0000, total: 10.00, notes: '' }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <Layout className="w-5 h-5" />
          <h1 className="text-xl font-bold">تقرير الورديات</h1>
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
              placeholder="بحث"
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
                <th className="p-3 border border-[var(--primary-hover)]">رقم الوردية</th>
                <th className="p-3 border border-[var(--primary-hover)]">وقت الافتتاح</th>
                <th className="p-3 border border-[var(--primary-hover)]">وقت الاغلاق</th>
                <th className="p-3 border border-[var(--primary-hover)]">المستخدم</th>
                <th className="p-3 border border-[var(--primary-hover)]">نقدي الصندوق</th>
                <th className="p-3 border border-[var(--primary-hover)]">شبكة</th>
                <th className="p-3 border border-[var(--primary-hover)]">تحويل بنكي</th>
                <th className="p-3 border border-[var(--primary-hover)]">اجمالي النقدي</th>
                <th className="p-3 border border-[var(--primary-hover)]">مذكرة</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, index) => (
                <tr key={shift.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                  <td className="p-3 border border-gray-200 text-sm">{shift.id}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.openTime}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.closeTime}</td>
                  <td className="p-3 border border-gray-200 text-sm whitespace-pre-line">{shift.user}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.cash.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.network.toFixed(4)}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.bank.toFixed(4)}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{shift.total.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm">{shift.notes}</td>
                </tr>
              ))}
              {/* Footer Row */}
              <tr className="bg-gray-100 font-bold text-gray-600">
                <td className="p-3 border border-gray-200 text-xs" colSpan={1}></td>
                <td className="p-3 border border-gray-200 text-xs">[yyyy-mm-dd HH:mm:ss]</td>
                <td className="p-3 border border-gray-200 text-xs">[yyyy-mm-dd HH:mm:ss]</td>
                <td className="p-3 border border-gray-200 text-xs">[المستخدم]</td>
                <td className="p-3 border border-gray-200 text-xs">[نقدي الصندوق]</td>
                <td className="p-3 border border-gray-200 text-xs">[إيصال]</td>
                <td className="p-3 border border-gray-200 text-xs">[الشبكات]</td>
                <td className="p-3 border border-gray-200 text-xs">[إجمالي النقدي]</td>
                <td className="p-3 border border-gray-200 text-xs">[مذكرة]</td>
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
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600">3</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600">4</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600">5</button>
            <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[var(--primary)] font-bold">
            عرض 1 إلى 10 من 44 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftsReport;
