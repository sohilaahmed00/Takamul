import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { BarChart2, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const InventoryChart = () => {
  const { dir } = useLanguage();

  // Mock data based on the image
  const data = [
    { name: 'قيمة المخزون بسعر البيع', value: 40, color: '#10b981' },
    { name: 'قيمة المخزون بسعر التكلفة', value: 35, color: '#10b981' },
    { name: 'ربح تقديري', value: 25, color: '#f59e0b' }
  ];

  const stats = [
    { label: 'اجمالي الكمية', value: '-196.00', color: 'bg-emerald-500' },
    { label: 'عدد الأصناف', value: '83.00', color: 'bg-orange-500' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-800">
          <BarChart2 className="w-5 h-5" />
          <h1 className="text-xl font-bold">رسم بياني للمخزون (جميع الفروع)</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border-x border-b border-gray-200 rounded-b-lg">
        <p className="text-emerald-800 font-medium mb-8">البيان الرئيسي لحالة المخزون بالمستودع.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.color} text-white p-6 rounded shadow-md text-center`}>
              <h3 className="text-lg font-bold mb-2">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="h-[350px] w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  paddingAngle={0}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;
