import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Edit, Trash2, Eye,
    ChevronDown, FileText, Upload, ArrowRight, ArrowLeft,
    RefreshCw, X, TrendingUp, TrendingDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';

// ===================== TYPES =====================
interface StockInventory {
    id: number;
    refNo?: string;
    referenceNumber?: string;
    branch?: string;
    branchName?: string;
    date?: string;
    createdAt?: string;
    entry?: string;
    entryBy?: string;
    note?: string;
    notes?: string;
    type?: 'add' | 'remove' | string;
    quantity?: number;
    productName?: string;
    productId?: number;
}

// ===================== API CONFIG =====================
const BASE_URL = 'http://takamulerp.runasp.net/api/StockInventory';

const API = {
    getAll: BASE_URL,
    create: BASE_URL,
    addStock: `${BASE_URL}/add-stock`,
    removeStock: `${BASE_URL}/remove-stock`,
};

// ===================== HELPERS =====================
const getRefNo = (s: StockInventory) => s.refNo || s.referenceNumber || `#${s.id}`;
const getBranch = (s: StockInventory) => s.branch || s.branchName || '-';
const getDate = (s: StockInventory) => {
    const d = s.date || s.createdAt;
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString('ar-EG'); } catch { return d; }
};
const getEntry = (s: StockInventory) => s.entry || s.entryBy || '-';
const getNote = (s: StockInventory) => s.note || s.notes || '-';

// ===================== COMPONENT =====================
export default function QuantityAdjustments() {
    const { direction } = useLanguage();
    const navigate = useNavigate();

    const [adjustments, setAdjustments] = useState<StockInventory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

    // Stock adjustment modal state
    const [showStockModal, setShowStockModal] = useState(false);
    const [stockModalType, setStockModalType] = useState<'add' | 'remove'>('add');
    const [stockForm, setStockForm] = useState({ productId: '', quantity: '', note: '' });
    const [stockLoading, setStockLoading] = useState(false);

    // ===================== FETCH =====================
    const fetchAdjustments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API.getAll);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            // Handle array, wrapped object {data: []}, {items: []}, {result: []}, or single object
            const data: StockInventory[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data) ? raw.data
                : Array.isArray(raw?.items) ? raw.items
                : Array.isArray(raw?.result) ? raw.result
                : raw && typeof raw === 'object' && !Array.isArray(raw) && raw.id
                    ? [raw]
                    : [];
            setAdjustments(data);
        } catch (err: any) {
            setError('فشل تحميل البيانات: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAdjustments(); }, [fetchAdjustments]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.action-menu-container') &&
                !(e.target as HTMLElement).closest('.action-menu-dropdown')) {
                setActiveActionMenu(null);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // ===================== FILTERING & PAGINATION =====================
    const filteredAdjustments = adjustments.filter(adj =>
        getBranch(adj).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getEntry(adj).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRefNo(adj).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (adj.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredAdjustments.length / itemsPerPage));
    const paginatedData = filteredAdjustments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ===================== HANDLERS =====================
    const handleDelete = async (id: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
        try {
            // No delete endpoint shown in API — remove from local state
            setAdjustments(prev => prev.filter(a => a.id !== id));
        } catch (err: any) {
            setError('فشل الحذف: ' + err.message);
        }
        setActiveActionMenu(null);
    };

    const openStockModal = (type: 'add' | 'remove') => {
        setStockModalType(type);
        setStockForm({ productId: '', quantity: '', note: '' });
        setShowStockModal(true);
        setActiveActionMenu(null);
    };

    const handleStockSubmit = async () => {
        if (!stockForm.productId || !stockForm.quantity) return;
        setStockLoading(true);
        try {
            const endpoint = stockModalType === 'add' ? API.addStock : API.removeStock;
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: Number(stockForm.productId),
                    quantity: Number(stockForm.quantity),
                    note: stockForm.note,
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setShowStockModal(false);
            fetchAdjustments(); // Refresh
        } catch (err: any) {
            setError((stockModalType === 'add' ? 'فشل إضافة المخزون: ' : 'فشل سحب المخزون: ') + err.message);
        } finally {
            setStockLoading(false);
        }
    };

    // ===================== RENDER =====================
    return (
        <div className="space-y-4" dir={direction}>

            {/* الهيدر */}
            <div className="takamol-page-header">
                <div className={direction === 'rtl' ? "text-right" : "text-left"}>
                    <h1 className="takamol-page-title flex items-center gap-2">
                        <FileText size={24} className="text-[var(--primary)]" />
                        <span>تعديلات الكمية</span>
                    </h1>
                    <p className="takamol-page-subtitle">إدارة وتتبع مذكرات تسوية المخزون</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => openStockModal('remove')}
                        className="btn-secondary flex items-center gap-2 !border-red-300 !text-red-600 hover:!bg-red-50"
                    >
                        <TrendingDown size={18} /> سحب مخزون
                    </button>
                    <button
                        onClick={() => openStockModal('add')}
                        className="btn-secondary flex items-center gap-2 !border-green-300 !text-green-700 hover:!bg-green-50"
                    >
                        <TrendingUp size={18} /> إضافة مخزون
                    </button>
                    <button
                        onClick={() => navigate('/products/quantity-adjustments/import')}
                        className="btn-secondary hidden md:flex"
                    >
                        <Upload size={20} /> استيراد المهام
                    </button>
                    <button
                        onClick={() => navigate('/products/quantity-adjustments/create')}
                        className="btn-primary"
                    >
                        <Plus size={20} /> إضافة تعديل كمية
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><X size={16} /></button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-w-0">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="بحث برقم المرجع، الفرع، المنتج..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="takamol-input !py-2"
                        />
                        <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", direction === 'rtl' ? "left-3" : "right-3")} size={18} />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                            onClick={fetchAdjustments}
                            className="p-2 text-gray-500 hover:text-[var(--primary)] hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                            title="تحديث البيانات"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <span>اظهر</span>
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-1.5 outline-none cursor-pointer"
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent" />
                    </div>
                )}

                {/* Mobile */}
                {!loading && (
                    <div className="md:hidden space-y-4">
                        {paginatedData.map((adj) => (
                            <MobileDataCard
                                key={adj.id}
                                title={getBranch(adj)}
                                subtitle={getDate(adj)}
                                fields={[
                                    { label: 'المرجع', value: getRefNo(adj) },
                                    { label: 'مدخل البيانات', value: getEntry(adj) },
                                    { label: 'المنتج', value: adj.productName || '-' },
                                    { label: 'الكمية', value: adj.quantity?.toString() || '-' },
                                    { label: 'مذكرة', value: getNote(adj) }
                                ]}
                                actions={
                                    <div className="flex gap-2 w-full justify-end">
                                        <button onClick={() => navigate(`/products/quantity-adjustments/edit/${adj.id}`)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(adj.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={18} /></button>
                                    </div>
                                }
                            />
                        ))}
                        {paginatedData.length === 0 && <div className="text-center p-6 text-gray-500 font-bold bg-gray-50 rounded-xl">لا توجد سجلات</div>}
                    </div>
                )}

                {/* Desktop Table */}
                {!loading && (
                    <div className="hidden md:block overflow-visible pb-32">
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="takamol-table mb-0">
                                <thead>
                                    <tr>
                                        <th className="w-10"><input type="checkbox" className="rounded border-white/30" /></th>
                                        <th>التاريخ</th>
                                        <th>الرقم المرجعي</th>
                                        <th>الفرع</th>
                                        <th>المنتج</th>
                                        <th>الكمية</th>
                                        <th>مدخل البيانات</th>
                                        <th>مذكرة</th>
                                        <th className="w-32 text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.length > 0 ? paginatedData.map(adj => (
                                        <tr key={adj.id}>
                                            <td><input type="checkbox" className="rounded border-gray-300" /></td>
                                            <td className="text-gray-800 font-bold whitespace-nowrap">{getDate(adj)}</td>
                                            <td className="font-bold text-[var(--primary)]">{getRefNo(adj)}</td>
                                            <td className="font-bold text-gray-700">{getBranch(adj)}</td>
                                            <td className="text-gray-700 font-medium">{adj.productName || '-'}</td>
                                            <td>
                                                {adj.quantity !== undefined ? (
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-xs font-bold",
                                                        adj.type === 'remove'
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-green-50 text-green-700"
                                                    )}>
                                                        {adj.type === 'remove' ? '-' : '+'}{adj.quantity}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="text-gray-600 font-medium">{getEntry(adj)}</td>
                                            <td className="text-gray-600 max-w-[150px] truncate" title={getNote(adj)}>{getNote(adj)}</td>

                                            <td className="text-center relative action-menu-container">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setMenuPosition({
                                                            top: rect.bottom + window.scrollY,
                                                            left: rect.left + window.scrollX + (rect.width / 2)
                                                        });
                                                        setActiveActionMenu(activeActionMenu === adj.id ? null : adj.id);
                                                    }}
                                                    className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 mx-auto transition-colors shadow-sm"
                                                >
                                                    خيارات <ChevronDown size={14} />
                                                </button>

                                                {activeActionMenu === adj.id && menuPosition && createPortal(
                                                    <div
                                                        style={{ position: 'absolute', top: `${menuPosition.top}px`, left: `${menuPosition.left}px`, transform: 'translateX(-50%)' }}
                                                        className="w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] py-2 overflow-hidden action-menu-dropdown"
                                                        dir={direction}
                                                    >
                                                        <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors text-start">
                                                            <Eye size={18} className="text-gray-400 shrink-0" /><span className="flex-1 font-medium">عرض التفاصيل</span>
                                                        </button>
                                                        <button onClick={() => { navigate(`/products/quantity-adjustments/edit/${adj.id}`); setActiveActionMenu(null); }} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors text-start">
                                                            <Edit size={18} className="text-gray-400 shrink-0" /><span className="flex-1 font-medium">تعديل</span>
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1 mx-4" />
                                                        <button onClick={() => handleDelete(adj.id)} className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors text-start">
                                                            <Trash2 size={18} className="shrink-0" /><span className="flex-1 font-medium">حذف</span>
                                                        </button>
                                                    </div>,
                                                    document.body
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={9} className="text-center py-8 text-gray-500 font-bold">لا توجد سجلات، قم بإضافة تعديل جديد.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 pt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-40"
                        >
                            <ArrowRight className="w-4 h-4" /> التالي
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "px-4 py-2 font-bold text-sm border-l border-gray-200",
                                    currentPage === page ? "bg-[#2ecc71] text-white" : "hover:bg-gray-50 text-gray-600"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-40"
                        >
                            سابق <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-sm font-bold text-gray-500">
                        إجمالي السجلات: {filteredAdjustments.length} | صفحة {currentPage} من {totalPages}
                    </div>
                </div>

            </div>

            {/* ===================== STOCK MODAL ===================== */}
            {showStockModal && (
                <div
                    className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                    onClick={() => setShowStockModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className={cn(
                            "p-5 flex justify-between items-center",
                            stockModalType === 'add' ? "bg-green-50 border-b border-green-100" : "bg-red-50 border-b border-red-100"
                        )}>
                            <h2 className={cn(
                                "text-lg font-bold flex items-center gap-2",
                                stockModalType === 'add' ? "text-green-800" : "text-red-700"
                            )}>
                                {stockModalType === 'add' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                {stockModalType === 'add' ? 'إضافة مخزون' : 'سحب مخزون'}
                            </h2>
                            <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">معرّف المنتج <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="أدخل ID المنتج"
                                    value={stockForm.productId}
                                    onChange={e => setStockForm(f => ({ ...f, productId: e.target.value }))}
                                    className="takamol-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">الكمية <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="أدخل الكمية"
                                    value={stockForm.quantity}
                                    onChange={e => setStockForm(f => ({ ...f, quantity: e.target.value }))}
                                    className="takamol-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">ملاحظة</label>
                                <textarea
                                    rows={3}
                                    placeholder="ملاحظة اختيارية..."
                                    value={stockForm.note}
                                    onChange={e => setStockForm(f => ({ ...f, note: e.target.value }))}
                                    className="takamol-input resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setShowStockModal(false)}
                                className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleStockSubmit}
                                disabled={stockLoading || !stockForm.productId || !stockForm.quantity}
                                className={cn(
                                    "flex-1 py-2.5 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
                                    stockModalType === 'add' ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                                )}
                            >
                                {stockLoading
                                    ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    : stockModalType === 'add' ? 'إضافة' : 'سحب'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}