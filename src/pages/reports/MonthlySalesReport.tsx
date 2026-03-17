import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MonthlySalesReport() {
  const { direction } = useLanguage();
  const [year, setYear] = useState(2026);

  const months = [
    { name: 'يناير', data: { discount: '14.78', shipping: '0.00', totalNoTax: '11770.79', itemTax: '1090.71', totalWithTax: '12861.50' } },
    { name: 'فبراير', data: { discount: '0.00', shipping: '0.00', totalNoTax: '551.62', itemTax: '82.73', totalWithTax: '634.35' } },
    { name: 'مارس', data: null },
    { name: 'إبريل', data: null },
    { name: 'ماي', data: null },
    { name: 'يونيو', data: null },
    { name: 'يوليو', data: null },
    { name: 'أغسطس', data: null },
    { name: 'سبتمبر', data: null },
    { name: 'أكتوبر', data: null },
    { name: 'نوفمبر', data: null },
    { name: 'ديسمبر', data: null },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-neutral-950 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-[var(--primary)]" size={20} />
          <h1 className="text-lg font-bold text-[var(--primary)]">المبيعات الشهرية (جميع الفروع)</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"><FileText size={16} className="text-[var(--primary)]" /></button>
        </div>
      </div>

      <div className="text-[var(--primary)] text-sm font-medium text-right">
        يمكنك تغيير الشهر، بالضغط {`>>`} (التالي) أو {`<<`} (السابق)
      </div>

      {/* Year Selector */}
      <div className="bg-[var(--primary)] text-white p-2 flex items-center justify-between rounded-t-lg">
        <button className="font-bold">{`<<`}</button>
        <span className="font-bold">{year}</span>
        <button className="font-bold">{`>>`}</button>
      </div>

      {/* Grid */}
      <div className="bg-white dark:bg-neutral-900 border-x border-b border-gray-200 dark:border-neutral-800 overflow-x-auto">
        <div className="flex min-w-max">
          {months.reverse().map((month, idx) => (
            <div key={idx} className="flex-1 border-r border-gray-100 dark:border-neutral-800 last:border-0 min-w-[120px]">
              <div className="bg-gray-50 dark:bg-neutral-950/50 p-2 text-center text-sm font-bold text-[var(--primary)] border-b border-gray-100 dark:border-neutral-800">
                {month.name}
              </div>
              <div className="p-2 space-y-2 min-h-[160px] flex flex-col justify-center items-center">
                {month.data ? (
                  <div className="w-full space-y-1 text-[10px] font-bold">
                    <div className="flex flex-col items-center">
                      <span className="text-[var(--primary)]">خصم</span>
                      <span>{month.data.discount}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[var(--primary)]">الشحن</span>
                      <span>{month.data.shipping}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[var(--primary)]">المجموع بدون ضريبة</span>
                      <span>{month.data.totalNoTax}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[var(--primary)]">ضريبة الصنف</span>
                      <span>{month.data.itemTax}</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[var(--primary)]">المجموع شامل الضريبة</span>
                      <span>{month.data.totalWithTax}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold">0</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
