import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Download, Printer, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function FinancialSummary() {
  const { direction } = useLanguage();
  
  const stats = [
    { title: 'إجمالي الإيرادات', value: '150,000.00', icon: <TrendingUp className="text-[var(--primary)]" />, trend: '+12%' },
    { title: 'إجمالي المصروفات', value: '45,000.00', icon: <TrendingDown className="text-[var(--primary)]" />, trend: '-5%' },
    { title: 'صافي الربح', value: '105,000.00', icon: <DollarSign className="text-blue-600" />, trend: '+18%' },
    { title: 'رصيد البنك', value: '250,000.00', icon: <Wallet className="text-purple-600" />, trend: '+2%' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" dir={direction}>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[var(--primary)] text-white rounded">
            <DollarSign size={18} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">التقارير المالية</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Printer size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {stat.icon}
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  stat.trend.startsWith('+') ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-red-100 text-red-700"
                )}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">ملخص مالي مفصل</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="font-medium">إجمالي المبيعات</span>
              <span className="font-bold text-[var(--primary)]">180,000.00</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="font-medium">إجمالي المشتريات</span>
              <span className="font-bold text-[var(--primary)]">60,000.00</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="font-medium">إجمالي المصروفات التشغيلية</span>
              <span className="font-bold text-[var(--primary)]">15,000.00</span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-lg font-bold">الربح التشغيلي</span>
              <span className="text-lg font-bold text-blue-600">105,000.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
