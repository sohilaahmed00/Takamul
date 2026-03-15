import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BarChart2, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BestSellersChart = () => {
  const { dir } = useLanguage();

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"];

  const periods = [
    {
      title: "Jan 2026",
      data: [
        { name: "حجز غرفة - غرفة 2 (حبة)", value: 28.7 },
        { name: "دجاج 900 جرام", value: 12.9 },
        { name: "تنظيف بشرة", value: 10.5 },
        { name: "حجز غرفة - غرفة 1 (حبة)", value: 9.4 },
        { name: "test", value: 8.8 },
        { name: "حلاقة ذقن", value: 6.4 },
        { name: "حلاقة شعر", value: 6.4 },
        { name: "بيتزا لحم", value: 6.4 },
        { name: "بيتزا خضار وسط PIZ MIDUEM", value: 5.3 },
        { name: "حجز غرفة - غرفة 1", value: 5.3 },
      ],
    },
    {
      title: "Feb 2026",
      data: [
        { name: "تنظيف بشرة", value: 20.0 },
        { name: "وجبة سندوتش زنجر", value: 14.3 },
        { name: "سفنج اورينكس", value: 11.4 },
        { name: "وجبة برجر دجاج", value: 11.4 },
        { name: "حلاقة شعر", value: 8.6 },
        { name: "وجبة برجر زنجر", value: 8.6 },
        { name: "برجر حراق", value: 8.6 },
        { name: "برجر فيليه", value: 5.7 },
        { name: "برجر جمبري", value: 5.7 },
        { name: "غسول نايتشرز باونتي 150 مل", value: 5.7 },
      ],
    },
    {
      title: "Mar 2025 - Feb 2026",
      data: [
        { name: "بيتزا دجاج", value: 17.9 },
        { name: "كباب لحم", value: 14.5 },
        { name: "حجز غرفة - غرفة 2 (حبة)", value: 12.9 },
        { name: "تنظيف بشرة", value: 10.8 },
        { name: "بيتزا خضار", value: 8.9 },
        { name: "حلاقة شعر", value: 7.9 },
        { name: "حلاقة ذقن", value: 7.4 },
        { name: "بيتزا لحم", value: 7.1 },
        { name: "شيش طاووق", value: 6.3 },
        { name: "دجاج 900 جرام", value: 6.3 },
      ],
    },
    {
      title: "Dec 2025 - Feb 2026",
      data: [
        { name: "بيتزا دجاج", value: 16.1 },
        { name: "كباب لحم", value: 15.5 },
        { name: "حجز غرفة - غرفة 2 (حبة)", value: 14.4 },
        { name: "تنظيف بشرة", value: 12.0 },
        { name: "حلاقة شعر", value: 8.8 },
        { name: "حلاقة ذقن", value: 8.2 },
        { name: "دجاج 900 جرام", value: 7.0 },
        { name: "مقبلات", value: 6.2 },
        { name: "بيتزا لحم", value: 5.9 },
        { name: "كرتون مويه", value: 5.9 },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={dir}>
      {/* Header */}
      <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-800">
          <BarChart2 className="w-5 h-5" />
          <h1 className="text-xl font-bold">الافضل مبيعا (جميع الفروع)</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-emerald-800 border border-emerald-800">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border-x border-b border-gray-200 rounded-b-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {periods.map((period, pIdx) => (
            <div key={period.title} className="border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h3 className="text-emerald-800 font-bold">{period.title}</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="h-[300px] w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={period.data} cx="50%" cy="50%" innerRadius={0} outerRadius={100} paddingAngle={0} dataKey="value" label={({ percent }) => `${(Number(percent) * 100).toFixed(1)}%`}>
                        {period.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px] w-full md:w-1/2">
                  {period.data.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-[10px]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                      <span className="font-medium text-gray-600 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellersChart;
