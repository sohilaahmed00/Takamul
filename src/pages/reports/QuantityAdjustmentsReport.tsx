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

const QuantityAdjustmentsReport = () => {
    const { dir } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock data based on the image
    const adjustments = [
        { id: 1, date: '12:25:00 29/01/2026', reference: 'Up0138', branch: 'نشاط الصالون', itemCode: '64402228', itemName: 'تنظيف بشرة', quantity: 1, cost: 0, total: 0.00 },
        { id: 2, date: '22:21:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', itemCode: '13032304', itemName: 'بندق', quantity: 2, cost: 0, total: 0.00 },
        { id: 3, date: '12:39:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', itemCode: '', itemName: '', quantity: 0, cost: 0, total: 0.00 },
        { id: 4, date: '12:39:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', itemCode: '75448610', itemName: 'قهوه تركيه غامق', quantity: 20, cost: 0, total: 0.00 },
        { id: 5, date: '12:24:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', itemCode: '', itemName: '', quantity: 0, cost: 0, total: 0.00 },
        { id: 6, date: '12:24:00 25/01/2026', reference: 'Up0139', branch: 'مغسلة سيارات', itemCode: '6287008230576', itemName: 'مويا ربتة', quantity: 1, cost: 0, total: 0.00 },
        { id: 7, date: '01:47:00 25/01/2026', reference: 'Up0137', branch: 'مغسلة سيارات', itemCode: '13032304', itemName: 'بندق', quantity: 5, cost: 0, total: 0.00 },
        { id: 8, date: '12:37:00 31/12/2025', reference: 'Up0136', branch: 'نشاط سوبر ماركت', itemCode: '21212121212121', itemName: 'مياه', quantity: 100, cost: 50, total: 5000.00 },
        { id: 9, date: '17:03:00 25/12/2025', reference: 'Up0135', branch: 'مغسلة سيارات', itemCode: '6972253511920', itemName: 'حلاقة ذقن', quantity: 10, cost: 0, total: 0.00 },
        { id: 10, date: '13:17:00 10/12/2025', reference: 'Up0133', branch: 'مغسلة سيارات', itemCode: '', itemName: '', quantity: 0.1, cost: 0, total: 0.00 }
    ];

    return (
        <div className="p-6 bg-white min-h-screen" dir={dir}>
            {/* Header */}
            <div className="bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-emerald-800">
                    <Filter className="w-5 h-5" />
                    <h1 className="text-xl font-bold">تقرير تعديلات الكميات</h1>
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
                <p className="text-emerald-800 font-medium mb-4">الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.</p>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder={t("search_label")}
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-800"
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
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-emerald-600 text-white">
                                <th className="p-3 border border-emerald-700">التاريخ</th>
                                <th className="p-3 border border-emerald-700">الرقم المرجعي</th>
                                <th className="p-3 border border-emerald-700">الفرع</th>
                                <th className="p-3 border border-emerald-700">كود الصنف</th>
                                <th className="p-3 border border-emerald-700">اسم الصنف</th>
                                <th className="p-3 border border-emerald-700">كمية</th>
                                <th className="p-3 border border-emerald-700">تكلفة</th>
                                <th className="p-3 border border-emerald-700">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustments?.map((adj, index) => (
                                <tr key={adj.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30')}>
                                    <td className="p-3 border border-gray-200 text-sm">{adj.date}</td>
                                    <td className="p-3 border border-gray-200 text-sm">{adj.reference}</td>
                                    <td className="p-3 border border-gray-200 text-sm">{adj.branch}</td>
                                    <td className="p-3 border border-gray-200 text-sm">{adj.itemCode}</td>
                                    <td className="p-3 border border-gray-200 text-sm">{adj.itemName}</td>
                                    <td className="p-3 border border-gray-200 text-sm font-bold">{adj.quantity}</td>
                                    <td className="p-3 border border-gray-200 text-sm font-bold">{adj.cost}</td>
                                    <td className="p-3 border border-gray-200 text-sm font-bold">{adj.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Footer Row */}
                            <tr className="bg-gray-50 font-bold text-gray-600">
                                <td className="p-3 border border-gray-200 text-xs">[التاريخ (yyyy-mm-dd)]</td>
                                <td className="p-3 border border-gray-200 text-xs">[الرقم المرجعي]</td>
                                <td className="p-3 border border-gray-200 text-xs">[الفرع]</td>
                                <td className="p-3 border border-gray-200 text-xs">[كود الصنف]</td>
                                <td className="p-3 border border-gray-200 text-xs">[اسم الصنف]</td>
                                <td className="p-3 border border-gray-200 text-sm"></td>
                                <td className="p-3 border border-gray-200 text-sm"></td>
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
                        <button className="px-4 py-2 bg-emerald-600 text-white border-l border-gray-300">1</button>
                        <button className="px-4 py-2 bg-white hover:bg-gray-100 border-l border-gray-300 text-gray-600">2</button>
                        <button className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-600 flex items-center gap-1">
                            سابق <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-emerald-800 font-bold">
                        عرض 1 إلى 10 من 12 سجلات
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuantityAdjustmentsReport;
