import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, Printer, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function DailySalesReport() {
  const { direction } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const stats = [
    { label: 'تكلفة الأصناف بدون ضريبة:', value: '0' },
    { label: 'ضريبة تكلفة الأصناف:', value: '0' },
    { label: 'تكلفة الأصناف شامل الضريبة:', value: '0.00' },
    { label: 'المبيعات بدون ضريبة (شامل الرجيع):', value: '0.00' },
    { label: 'ضريبة الأصناف المباعة (شامل الرجيع):', value: '0' },
    { label: 'المبيعات والرجيع شامل الضريبة:', value: '0' },
    { label: 'إجمالي المشتريات بدون ضريبة:', value: '0.00' },
    { label: 'إجمالي ضريبة المشتريات:', value: '0' },
    { label: 'إجمالي المشتريات شامل الضريبة:', value: '0' },
    { label: 'المصروفات :', value: '0' },
    { label: 'الليستة :', value: '0' },
    { label: 'الربح بدون ضريبة:', value: '0.00' },
    { label: 'رجيع المبيعات:', value: '0' },
  ];

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 min-h-screen" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-emerald-800" size={20} />
          <h1 className="text-lg font-bold text-emerald-800">المبيعات اليومية (جميع الفروع)</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"><FileText size={16} className="text-emerald-600" /></button>
        </div>
      </div>

      <div className="text-emerald-800 text-sm font-medium text-right">
        get day profit يمكنك تغيير الشهر، بالضغط {`>>`} (التالي) أو {`<<`} (السابق)
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-8">
          <button className="text-emerald-800 font-bold text-xl">{`<<`}</button>
          <div className="text-xl font-bold text-gray-800 dark:text-white">مارس 2026</div>
          <button className="text-emerald-800 font-bold text-xl">{`>>`}</button>
        </div>

        <div className="grid grid-cols-7 gap-4 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
          {weekDays.map((day, idx) => (
            <div key={idx} className="font-bold text-gray-600 dark:text-gray-400 text-sm pb-4">{day}</div>
          ))}
          
          {padding.map((_, idx) => (
            <div key={`pad-${idx}`} className="h-12"></div>
          ))}

          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-12 flex items-center justify-center text-sm font-medium rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors",
                day === 5 ? "text-emerald-600 font-bold" : "text-gray-700 dark:text-gray-300"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
              <div className="flex flex-col items-center flex-1">
                <h2 className="text-xl font-bold text-emerald-800">Takamul - جميع الفروع</h2>
                <p className="text-sm font-bold text-emerald-800">تقرير مختصر عن العمليات بتاريخ ({selectedDay}/03/2026)</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors">
                <Printer size={14} />
                طباعة
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-end mb-4">
                <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-600 dark:bg-gray-700 text-right w-full">
                  <option>جميع الفروع</option>
                </select>
              </div>

              <div className="space-y-0.5">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-lg font-bold text-emerald-800">{stat.value}</span>
                    <span className="text-sm font-bold text-emerald-800">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
