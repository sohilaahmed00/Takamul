import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Search, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function SalesReport() {
    const { direction } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // الكروت العلوية
    const cards = [
        { title: 'اجمالي مبيعات بدون ضريبة بعد الخصم', value: '21664.20', color: 'bg-orange-500' },
        { title: 'اجمالي ضريبة الصنف', value: '2574.76', color: 'bg-[#2ecc71]' },
        { title: 'مجموع المبيعات', value: '24238.95', color: 'bg-teal-500' },
        { title: 'اجمالي الربح(عمولة المسوقين)', value: '18970.61(0.00)', color: 'bg-[#27ae60]' },
        { title: 'اجمالي الليسته', value: '50.00', color: 'bg-pink-600' },
        { title: 'اجمالي الخصومات', value: '14.78', color: 'bg-green-600' },
        { title: 'مبيعات شامل ضريبة بدون مرتجع', value: '25059.60', color: 'bg-orange-600' },
        { title: 'مجموع الرجيع', value: '-820.65', color: 'bg-red-500' },
    ];

    const data = [
        { id: '361', date: '28/02/2026 23:59:31', ref: 'SALE/POS0446', cashier: 'شركة تجريبي', user: 'saad', customer: 'شخص عام', total: '9.00', paid: '9.00', current: '0.00', list: '0.00', noTax: '7.83', tax: '1.17', profit: '7.83', discount: '0.00', status: 'مدفوع' },
        { id: '360', date: '28/02/2026 16:58:05', ref: 'SALE/POS0445', cashier: 'شركة تجريبي', user: 'admin', customer: 'شخص عام', total: '13.00', paid: '13.00', current: '0.00', list: '0.00', noTax: '11.30', tax: '1.70', profit: '7.30', discount: '0.00', status: 'مدفوع' },
        { id: '359', date: '28/02/2026 16:57:11', ref: 'SALE/POS0444', cashier: 'شركة تجريبي', user: 'admin', customer: 'شخص عام', total: '8.00', paid: '8.00', current: '0.00', list: '0.00', noTax: '6.96', tax: '1.04', profit: '2.16', discount: '0.00', status: 'مدفوع' },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6" dir={direction}>

            {/* 1. استخدام أسطمبة الهيدر الجاهزة من الـ CSS */}
            <div className="takamol-page-header !mb-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#e6f4ea] rounded-xl text-[var(--primary)]">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h1 className="takamol-page-title">تقرير المبيعات</h1>
                        <p className="takamol-page-subtitle">يرجى تخصيص التقرير أدناه</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronDown size={18} className="text-gray-600" /></button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronUp size={18} className="text-gray-600" /></button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><FileText size={18} className="text-gray-600" /></button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><FileSpreadsheet size={18} className="text-gray-600" /></button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards?.map((card, idx) => (
                    <div key={idx} className={cn("p-5 rounded-xl shadow-sm text-white flex flex-col items-center justify-center text-center space-y-2 hover:-translate-y-1 transition-transform duration-300", card.color)}>
                        <div className="text-xs font-bold opacity-90">{card.title}</div>
                        <div className="text-xl font-black">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* 2. استخدام أسطمبة الخانات الجاهزة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">إظهار</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="w-20"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-bold text-gray-700">بحث:</span>
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="اكتب للبحث..."
                            className="takamol-input pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* 3. السحر الحقيقي هنا: تطبيق الكلاس الموحد للجدول */}
            <div className="takamol-table-container">
                <div className="overflow-x-auto">
                    {/* تم مسح جميع الكلاسات القديمة والاكتفاء بكلاس takamol-table */}
                    <table className="takamol-table">
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>التاريخ</th>
                                <th>الرقم المرجعي</th>
                                <th>كاشير</th>
                                <th>المستخدم</th>
                                <th>عميل</th>
                                <th>المجموع الكلي</th>
                                <th>مدفوع</th>
                                <th>الرصيد الحالي</th>
                                <th>سعر الليسته</th>
                                <th>الاجمالي بدون ضريبة</th>
                                <th>قيمة الضريبة</th>
                                <th>الربح</th>
                                <th>خصم</th>
                                <th>حالة الدفع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* لاحظ أن الـ td لم يعد يحتاج لكتابة border أو padding، الـ CSS يقوم بذلك */}
                            {data?.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="font-bold">{row.id}</td>
                                    <td>{row.date}</td>
                                    <td className="font-medium text-gray-600">{row.ref}</td>
                                    <td>{row.cashier}</td>
                                    <td>{row.user}</td>
                                    <td className="font-bold text-gray-800">{row.customer}</td>
                                    <td className="font-bold text-[var(--primary)]">{row.total}</td>
                                    <td className="font-medium text-gray-700">{row.paid}</td>
                                    <td>{row.current}</td>
                                    <td>{row.list}</td>
                                    <td className="font-bold">{row.noTax}</td>
                                    <td className="text-red-500 font-medium">{row.tax}</td>
                                    <td className="font-bold text-blue-600">{row.profit}</td>
                                    <td>{row.discount}</td>
                                    <td>
                                        <span className="bg-[#e6f4ea] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-bold inline-block">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                <div className="text-sm font-bold text-gray-600">
                    عرض 1 إلى 10 من 361 سجلات
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">التالي &gt;</button>
                    <button className="px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">2</button>
                    <button className="px-3 py-1.5 bg-[var(--primary)] border border-[var(--primary)] rounded-lg text-sm font-bold text-white shadow-sm">1</button>
                    <button className="px-3 py-1.5 border border-gray-200 bg-gray-100 rounded-lg text-sm font-bold text-gray-400 cursor-not-allowed">&lt; سابق</button>
                </div>
            </div>

        </div>
    );
}