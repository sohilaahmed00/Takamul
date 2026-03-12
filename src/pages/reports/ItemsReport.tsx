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
  Barcode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const ItemsReport = () => {
  const { dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data based on typical inventory reports
  const items = [
    { id: 1, code: '1001', name: 'بيبسي 330 مل', category: 'مشروبات', price: 2.50, cost: 1.80, stock: 150, unit: 'حبة' },
    { id: 2, code: '1002', name: 'أرز بسمتي 5 كجم', category: 'مواد غذائية', price: 45.00, cost: 38.00, stock: 45, unit: 'كيس' },
    { id: 3, code: '1003', name: 'زيت طبخ 1.5 لتر', category: 'مواد غذائية', price: 18.00, cost: 14.50, stock: 60, unit: 'حبة' },
    { id: 4, code: '1004', name: 'حليب كامل الدسم 1 لتر', category: 'ألبان', price: 6.00, cost: 4.80, stock: 85, unit: 'حبة' },
    { id: 5, code: '1005', name: 'صابون يدين 500 مل', category: 'منظفات', price: 12.00, cost: 9.00, stock: 30, unit: 'حبة' }
  ];

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-800">
          <Barcode className="w-5 h-5" />
          <h1 className="text-xl font-bold">تقارير الأصناف</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <FileText className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <FileSpreadsheet className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border-x border-gray-200">
        <p className="text-emerald-800 font-medium mb-4">قائمة بجميع الأصناف المسجلة في النظام</p>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث عن صنف..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-800 text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-800">اظهار</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-800"
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
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 border border-emerald-700">كود الصنف</th>
                <th className="p-3 border border-emerald-700">اسم الصنف</th>
                <th className="p-3 border border-emerald-700">التصنيف</th>
                <th className="p-3 border border-emerald-700">الوحدة</th>
                <th className="p-3 border border-emerald-700">سعر البيع</th>
                <th className="p-3 border border-emerald-700">سعر التكلفة</th>
                <th className="p-3 border border-emerald-700">المخزون</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30')}>
                  <td className="p-3 border border-gray-200 text-sm">{item.code}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{item.name}</td>
                  <td className="p-3 border border-gray-200 text-sm">{item.category}</td>
                  <td className="p-3 border border-gray-200 text-sm">{item.unit}</td>
                  <td className="p-3 border border-gray-200 text-sm font-bold">{item.price.toFixed(2)}</td>
                  <td className="p-3 border border-gray-200 text-sm">{item.cost.toFixed(2)}</td>
                  <td className={cn(
                    "p-3 border border-gray-200 text-sm font-bold",
                    item.stock < 50 ? "text-emerald-600" : "text-emerald-600"
                  )}>
                    {item.stock}
                  </td>
                </tr>
              ))}
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
            عرض 1 إلى 5 من 5 سجلات
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsReport;
