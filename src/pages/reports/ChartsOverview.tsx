import React from 'react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BarChart2, Maximize2, Minus, Plus, Search, Home, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ChartsOverview = () => {
  const { dir } = useLanguage();

  // Mock data based on the image
  const data = [
    { name: 'Sep-2025', sales: 1100, purchases: 100, tax: 71, buyTax: 0 },
    { name: 'Oct-2025', sales: 600, purchases: 0, tax: 8, buyTax: 0 },
    { name: 'Nov-2025', sales: 1519.31, purchases: 220, tax: 94, buyTax: 0 },
    { name: 'Dec-2025', sales: 7624.18, purchases: 1143.67, tax: 450, buyTax: 67.5 },
    { name: 'Jan-2026', sales: 11785.58, purchases: 1090.71, tax: 424.79, buyTax: 65.22 },
    { name: 'Feb-2026', sales: 551.62, purchases: 82.74, tax: 0, buyTax: 0 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--primary)]">
          <BarChart2 className="w-5 h-5" />
          <h1 className="text-xl font-bold">نظرة عامة على الرسم البياني</h1>
        </div>
        <div className="flex gap-2 text-[var(--primary)]">
          <BarChart2 className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-6 border-x border-b border-gray-200 rounded-b-lg">
        <p className="text-[var(--primary)] font-medium mb-6">نظرة عامة على قيم المخزون - الضرائب .</p>

        {/* Chart Controls (Mock) */}
        <div className="flex justify-end gap-2 mb-4 text-gray-500">
          <Plus className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
          <Minus className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
          <Search className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
          <Maximize2 className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
          <Home className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
          <Menu className="w-4 h-4 cursor-pointer hover:text-[var(--primary)]" />
        </div>

        {/* Main Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                formatter={(value: any) => [value.toFixed(2), '']}
              />
              <Legend verticalAlign="bottom" height={36}/>
              <Area 
                type="monotone" 
                dataKey="sales" 
                name="المبيعات" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                strokeWidth={3}
                label={{ position: 'top', fill: '#22c55e', fontSize: 10, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="purchases" 
                name="المشتريات" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4 }}
                label={{ position: 'top', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="tax" 
                name="ضرائب الصنف المباع" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ r: 4 }}
                label={{ position: 'top', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="buyTax" 
                name="ضرائب شراء الصنف" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4 }}
                label={{ position: 'top', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-[var(--primary)] font-medium mt-8">
          يمكنك تغيير الرسم البياني عن طريق النقر وسيلة إيضاح التخطيط. انقر فوق أي علامة توضيحية فوق لإظهار / إخفاء ذلك في الرسم البياني.
        </p>
      </div>
    </div>
  );
};

export default ChartsOverview;
