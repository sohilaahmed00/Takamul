import React, { useState } from 'react';
import { DollarSign, Search, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Pagination from '@/components/Pagination';

export default function ExpensesList() {
    const { t, direction, language } = useLanguage();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesCount, setEntriesCount] = useState(10);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    return (
        <div className="p-4 space-y-6 pb-12" dir={direction}>

            {/* 1. استخدام أسطمبة الهيدر الجاهزة من الـ CSS الموحد */}
            <div className="takamol-page-header">
                <div className="flex items-center gap-3">
                    <div className="bg-[#e6f4ea] border border-[#00a651]/20 p-2.5 rounded-xl text-[var(--primary)]">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h1 className="takamol-page-title">{t('expenses')}</h1>
                        <p className="takamol-page-subtitle">{t('please_use_table_below')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-h-[500px]">
                <div className="space-y-6">

                    {/* Controls: إظهار & بحث */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-700">{t('show')}</span>
                            <select
                                value={entriesCount}
                                onChange={(e) => setEntriesCount(Number(e.target.value))}
                                className="takamol-input py-1.5 px-3 w-20"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        {/* إصلاح مشكلة تداخل أيقونة البحث */}
                        <div className="w-full md:w-72 flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:border-[var(--primary)] transition-colors shadow-sm">
                            <Search className="text-gray-400 shrink-0 ml-2" size={18} />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 w-full bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* 2. السحر الحقيقي: استخدام الكلاسات الموحدة للجداول بالكيرف الدائري */}
                    <div className="hidden md:block pb-10 w-full">
                        <div className="takamol-table-container">
                            <div className="overflow-x-auto">
                                {/* تم حذف كلاسات border لأنها مدمجة في takamol-table */}
                                <table className="takamol-table min-w-[900px]">
                                    <thead>
                                        <tr>
                                            {/* تم إزالة خانة التحديد Checkbox بناءً على طلبك */}
                                            <th>{t('date')}</th>
                                            <th>{t('reference')}</th>
                                            <th>{t('expense_category')}</th>
                                            <th>{t('paid')}</th>
                                            <th>{t('description')}</th>
                                            <th>{t('data_entry_user')}</th>
                                            <th className="w-10 text-center">
                                                <LinkIcon size={16} className="mx-auto" />
                                            </th>
                                            <th className="w-24 text-center">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-gray-500 font-bold">
                                                {t('no_data_in_table')}
                                            </td>
                                        </tr>

                                        {/* مثال لكيفية وضع زر التعديل عندما يكون هناك بيانات:
                            <td className="relative action-menu-container">
                                <button 
                                  onClick={() => navigate('/products/create')} // مسار التعديل الذي طلبته
                                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm mx-auto"
                                >
                                    خيارات <ChevronDown size={16} strokeWidth={2.5} />
                                </button>
                            </td> 
                          */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            {t('no_data_in_table')}
                        </div>
                    </div>

                    {/* Pagination Section */}
                    <Pagination
                        currentPage={1}
                        totalPages={1}
                        totalItems={0}
                        itemsPerPage={entriesCount}
                        onPageChange={() => { }}
                    />
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={expenseToDelete !== null}
                onClose={() => setExpenseToDelete(null)}
                onConfirm={() => {
                    // In a real app, delete the expense
                    setExpenseToDelete(null);
                }}
                itemName={language === 'ar' ? 'هذا المصروف' : 'this expense'}
            />
        </div>
    );
}