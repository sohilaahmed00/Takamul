import React, { useState } from 'react';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const MonthlyPurchasesReport = () => {
  const { dir } = useLanguage();
  const [currentYear, setCurrentYear] = useState(2026);

  const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'ماي', 'يونيو', 
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // Mock data based on the image
  const monthlyData = {
    'يناير': {
      discount: 0.00,
      shipping: 0.00,
      tax: 65.22,
      total: 500.01
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-800">
          <Calendar className="w-5 h-5" />
          <h1 className="text-xl font-bold">المشتريات الشهرية (جميع الفروع)</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border-x border-gray-200">
        <p className="text-emerald-800 font-medium mb-4 text-center">
          يمكنك تغيير الشهر، بالضغط {dir === 'rtl' ? '>>' : '<<'} (التالي) أو {dir === 'rtl' ? '<<' : '>>'} (السابق)
        </p>

        {/* Year Selector */}
        <div className="bg-emerald-800 text-white p-2 flex justify-between items-center rounded mb-6">
          <button onClick={() => setCurrentYear(prev => prev - 1)} className="hover:bg-emerald-700 p-1 rounded">
            {dir === 'rtl' ? '>>' : '<<'}
          </button>
          <span className="font-bold text-lg">{currentYear}</span>
          <button onClick={() => setCurrentYear(prev => prev + 1)} className="hover:bg-emerald-700 p-1 rounded">
            {dir === 'rtl' ? '<<' : '>>'}
          </button>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 border border-gray-200 rounded overflow-hidden">
          {months.map((month) => (
            <div key={month} className="border-r border-gray-200 last:border-r-0 flex flex-col min-h-[200px]">
              <div className="bg-gray-50 p-2 text-center font-bold text-emerald-800 border-b border-gray-200">
                {month}
              </div>
              <div className="flex-1 p-2 flex flex-col justify-center items-center gap-4">
                {monthlyData[month] ? (
                  <div className="w-full space-y-2">
                    <div className="text-center">
                      <p className="text-emerald-600 text-xs font-bold">خصم</p>
                      <p className="text-sm font-bold">{monthlyData[month].discount.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-600 text-xs font-bold">الشحن</p>
                      <p className="text-sm font-bold">{monthlyData[month].shipping.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-600 text-xs font-bold">ضريبة الصنف</p>
                      <p className="text-sm font-bold">{monthlyData[month].tax.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-600 text-xs font-bold">المجموع</p>
                      <p className="text-sm font-bold">{monthlyData[month].total.toFixed(2)}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 font-bold">0</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPurchasesReport;
