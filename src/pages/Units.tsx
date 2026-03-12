import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, ChevronDown, Edit, Trash2, PlusCircle, Search, Check, X, RefreshCw } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// ===================== TYPES =====================
interface Unit {
    id: number;
    name: string;
    description?: string;
}

interface ApiResponse {
    items: Unit[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

// ===================== API =====================
const BASE_URL = 'http://takamulerp.runasp.net/api/UnitOfMeasure';
const API = {
    getAll: BASE_URL,
    create: BASE_URL,
    update: (id: number) => `${BASE_URL}/${id}`,
    delete: (id: number) => `${BASE_URL}/${id}`,
};

// ===================== HELPERS =====================
const getName = (u: Unit) => u.name || '-';
const getDesc = (u: Unit) => u.description || '-';

// ===================== COMPONENT =====================
const Units = () => {
    const { t, direction } = useLanguage();

    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [openActionId, setOpenActionId] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    // Add modal state (inline — no external component needed)
    const [showAddModal, setShowAddModal] = useState(false);
    const [addName, setAddName] = useState('');
    const [addDesc, setAddDesc] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // ===================== FETCH =====================
    const fetchUnits = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await fetch(API.getAll);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw: ApiResponse = await res.json();
            setUnits(raw.items || []);
        } catch (err: any) {
            setError('فشل تحميل البيانات: ' + err.message);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUnits(); }, [fetchUnits]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
                setOpenActionId(null); setMenuPosition(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ===================== FILTER / PAGE =====================
    const filteredUnits = units.filter(u =>
        getName(u).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedUnits = filteredUnits.slice(
        (currentPage - 1) * itemsPerPage, currentPage * itemsPerPage
    );

    // ===================== ADD =====================
    const handleAddUnit = async () => {
        if (!addName.trim()) { setAddError('اسم الوحدة مطلوب'); return; }
        setAddLoading(true); setAddError(null);
        try {
            const payload: any = { name: addName.trim(), description: addDesc.trim() };

            const res = await fetch(API.create, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errBody = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status}: ${errBody}`);
            }
            setShowAddModal(false);
            setAddName(''); setAddDesc('');
            fetchUnits();
        } catch (err: any) {
            setAddError('فشل الإضافة: ' + err.message);
        } finally { setAddLoading(false); }
    };

    // ===================== EDIT =====================
    const startEdit = (unit: Unit) => {
        setEditingId(unit.id);
        setEditName(getName(unit));
        setEditDesc(unit.description || '');
        setOpenActionId(null); setMenuPosition(null);
    };

    const saveEdit = async (id: number) => {
        if (!editName.trim()) return;
        setEditLoading(true);
        try {
            const payload = { id, name: editName.trim(), description: editDesc.trim() };

            // PUT /api/UnitOfMeasure/{id}
            const res = await fetch(API.update(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errBody = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status}: ${errBody}`);
            }

            setEditingId(null);
            fetchUnits();
        } catch (err: any) {
            setError('فشل التعديل: ' + err.message);
            setEditingId(null);
        } finally { setEditLoading(false); }
    };

    const cancelEdit = () => { setEditingId(null); setEditName(''); setEditDesc(''); };

    // ===================== DELETE =====================
    const handleDelete = (id: number) => {
        setUnitToDelete(id); setOpenActionId(null); setMenuPosition(null);
    };

    const confirmDelete = async () => {
        if (unitToDelete === null) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(API.delete(unitToDelete), { method: 'DELETE' });
            // 200, 204 = success; some APIs return 404 if already deleted
            if (!res.ok && res.status !== 404) {
                const errBody = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status}: ${errBody}`);
            }
            setUnitToDelete(null); fetchUnits();
        } catch (err: any) {
            setError('فشل الحذف: ' + err.message); setUnitToDelete(null);
        } finally { setDeleteLoading(false); }
    };

    const toggleActionMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (openActionId === id) { setOpenActionId(null); setMenuPosition(null); return; }
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const menuWidth = 160;
        setOpenActionId(id);
        setMenuPosition({
            top: rect.bottom + 5,
            left: Math.max(10, direction === 'rtl' ? rect.right - menuWidth : rect.left)
        });
    };

    // ===================== RENDER =====================
    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 flex items-center gap-1">
                <span>{t('home')}</span><span>/</span>
                <span>{t('products')}</span><span>/</span>
                <span className="text-gray-800 font-medium">{t('units')}</span>
            </div>

            {/* Header */}
            <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">{t('units')}</h1>
                <div className="flex gap-2">
                    <button onClick={fetchUnits} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors" title="تحديث">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => { setShowAddModal(true); setAddName(''); setAddDesc(''); setAddError(null); }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium">
                        <PlusCircle size={18} />{t('add_new_unit')}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span>{error}</span><button onClick={() => setError(null)}><X size={16} /></button>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{t('show')}</span>
                        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-green-500 text-black">
                            <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
                        </select>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <input type="text" placeholder={t('search_placeholder')}
                            className={`w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-black ${direction === 'rtl' ? 'pr-8' : 'pl-8'}`}
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${direction === 'rtl' ? 'right-2' : 'left-2'}`} size={16} />
                    </div>
                </div>

                {/* Loading */}
                {loading && <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" /></div>}

                {/* Desktop Table */}
                {!loading && (
                    <div className="hidden md:block overflow-hidden rounded-t-xl">
                        <table className="w-full text-sm text-right text-gray-500 border-collapse">
                            <thead className="text-xs text-white uppercase bg-green-600">
                                <tr>
                                    <th className="px-6 py-3">{t('unit_name')}</th>
                                    <th className="px-6 py-3">الوصف</th>
                                    <th className="px-6 py-3 text-center">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {paginatedUnits.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">{t('no_results_found')}</td></tr>
                                ) : paginatedUnits.map((unit) => (
                                    <tr key={unit.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {editingId === unit.id ? (
                                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                                    className="border border-green-500 rounded px-2 py-1 text-sm w-32 focus:outline-none" autoFocus />
                                            ) : getName(unit)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === unit.id ? (
                                                <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                                                    className="border border-green-500 rounded px-2 py-1 text-sm w-32 focus:outline-none" />
                                            ) : getDesc(unit)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {editingId === unit.id ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => saveEdit(unit.id)} disabled={editLoading}
                                                        className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50">
                                                        {editLoading ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" /> : <Check size={14} />}
                                                    </button>
                                                    <button onClick={cancelEdit} className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <button onClick={(e) => toggleActionMenu(unit.id, e)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors">
                                                    <span>{t('actions')}</span><ChevronDown size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Mobile */}
                {!loading && (
                    <div className="md:hidden space-y-3">
                        {paginatedUnits.map((unit) => (
                            <div key={unit.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                {editingId === unit.id ? (
                                    <div className="space-y-2 mb-3">
                                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                                            className="w-full border border-green-500 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none" autoFocus placeholder="اسم الوحدة" />
                                        <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                                            className="w-full border border-green-400 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="الوصف" />
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <p className="font-bold text-gray-800 text-base">{getName(unit)}</p>
                                        <p className="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{getDesc(unit)}</p>
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                    {editingId === unit.id ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); saveEdit(unit.id); }}
                                                disabled={editLoading}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {editLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <><Check size={15} /> حفظ</>}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
                                            >
                                                <X size={15} /> إلغاء
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); startEdit(unit); }}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold hover:bg-green-100"
                                            >
                                                <Edit size={15} /> تعديل
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(unit.id); }}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100"
                                            >
                                                <Trash2 size={15} /> حذف
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {paginatedUnits.length === 0 && !loading && (
                            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">{t('no_results_found')}</div>
                        )}
                    </div>
                )}

                <div className="rounded-b-xl">
                    <Pagination currentPage={currentPage} totalItems={filteredUnits.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
                </div>

                {/* Action Menu */}
                <AnimatePresence>
                    {openActionId !== null && menuPosition && (
                        <motion.div ref={actionMenuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-40 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                            style={{ top: menuPosition.top, left: menuPosition.left }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => { const u = units.find(u => u.id === openActionId); if (u) startEdit(u); }}
                                className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                                {direction === 'rtl'
                                    ? <><span>{t('edit')}</span><Edit size={14} className="text-green-600" /></>
                                    : <><Edit size={14} className="text-green-600" /><span>{t('edit')}</span></>}
                            </button>
                            <button onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => handleDelete(openActionId)}
                                className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                                {direction === 'rtl'
                                    ? <><span>{t('delete')}</span><Trash2 size={14} className="text-red-500" /></>
                                    : <><Trash2 size={14} className="text-red-500" /><span>{t('delete')}</span></>}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ===================== ADD MODAL ===================== */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()} dir="rtl">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-50">
                            <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
                                <PlusCircle size={20} />{t('add_new_unit')}
                            </h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {addError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm flex justify-between">
                                    <span>{addError}</span><button onClick={() => setAddError(null)}><X size={14} /></button>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('unit_name')} <span className="text-red-500">*</span></label>
                                <input type="text" value={addName} onChange={e => setAddName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddUnit()}
                                    placeholder="مثال: كيلو، قطعة، لتر"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 text-black" autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">الوصف</label>
                                <input type="text" value={addDesc} onChange={e => setAddDesc(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddUnit()}
                                    placeholder="وصف الوحدة"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 text-black" />
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
                            <button onClick={handleAddUnit} disabled={addLoading}
                                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {addLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'إضافة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== DELETE MODAL ===================== */}
            {unitToDelete !== null && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setUnitToDelete(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl" onClick={e => e.stopPropagation()} dir="rtl">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={30} /></div>
                        <h2 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h2>
                        <p className="text-gray-500 mb-1 text-sm font-bold">{units.find(u => u.id === unitToDelete)?.name}</p>
                        <p className="text-gray-400 mb-6 text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUnitToDelete(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
                            <button onClick={confirmDelete} disabled={deleteLoading}
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                                {deleteLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : 'حذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Units;