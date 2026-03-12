import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, Edit2, Trash2, Plus, X, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';
import Pagination from '@/components/Pagination';

// ===================== TYPES =====================
interface Supplier {
    id: number;
    supplierCode?: string | null;
    supplierName: string;
    email: string;
    phone: string;
    mobile?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    taxNumber?: string;
    paymentTerms?: number;
    isActive?: boolean;
}

// ===================== API =====================
const BASE_URL = 'http://takamulerp.runasp.net/api/Suppliers';
const API = {
    getAll: BASE_URL,
    create: BASE_URL,
    update: (id: number) => `${BASE_URL}/${id}`,
    delete: (id: number) => `${BASE_URL}/${id}`,
};

const emptyForm = {
    supplierName: '', email: '', phone: '', mobile: '',
    taxNumber: '', address: '', city: '', state: '',
    country: '', postalCode: '', paymentTerms: '30',
};

// ===================== COMPONENT =====================
export default function SuppliersList() {
    const { t, direction } = useLanguage();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ===================== FETCH =====================
    const fetchSuppliers = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await fetch(API.getAll);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            const data: Supplier[] = Array.isArray(raw) ? raw
                : Array.isArray(raw?.data) ? raw.data
                : Array.isArray(raw?.items) ? raw.items
                : raw?.id ? [raw] : [];
            setSuppliers(data);
        } catch (err: any) {
            setError('فشل تحميل البيانات: ' + err.message);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

    // ===================== DERIVED =====================
    const filteredSuppliers = suppliers.filter(s =>
        (s.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone || '').includes(searchTerm) ||
        (s.taxNumber || '').includes(searchTerm)
    );
    const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / entriesPerPage));
    const paginatedSuppliers = filteredSuppliers.slice(
        (currentPage - 1) * entriesPerPage, currentPage * entriesPerPage
    );

    const toggleSelectAll = () => setSelectedSuppliers(
        selectedSuppliers.length === paginatedSuppliers.length ? [] : paginatedSuppliers.map(s => s.id)
    );
    const toggleSelect = (id: number) => setSelectedSuppliers(prev =>
        prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );

    // ===================== MODAL =====================
    const openAdd = () => {
        setEditingSupplier(null); setForm(emptyForm); setFormError(null); setIsModalOpen(true);
    };
    const openEdit = (s: Supplier) => {
        setEditingSupplier(s);
        setForm({
            supplierName: s.supplierName || '',
            email: s.email || '',
            phone: s.phone || '',
            mobile: s.mobile || '',
            taxNumber: s.taxNumber || '',
            address: s.address || '',
            city: s.city || '',
            state: s.state || '',
            country: s.country || '',
            postalCode: s.postalCode || '',
            paymentTerms: String(s.paymentTerms ?? 30),
        });
        setFormError(null); setIsModalOpen(true);
    };

    const handleFormSubmit = async () => {
        if (!form.supplierName.trim()) { setFormError('اسم المورد مطلوب'); return; }
        setFormLoading(true); setFormError(null);
        try {
            const payload = {
                supplierName: form.supplierName,
                email: form.email || '',
                phone: form.phone || '',
                mobile: form.mobile || '',
                taxNumber: form.taxNumber || '',
                address: form.address || '',
                city: form.city || '',
                state: form.state || '',
                country: form.country || '',
                postalCode: form.postalCode || '',
                paymentTerms: Number(form.paymentTerms) || 0,
            };

            if (editingSupplier) {
                const res = await fetch(API.update(editingSupplier.id), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingSupplier.id, ...payload }),
                });
                if (!res.ok) {
                    const errBody = await res.text().catch(() => '');
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
            } else {
                const res = await fetch(API.create, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errBody = await res.text().catch(() => '');
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }
            }
            setIsModalOpen(false);
            fetchSuppliers();
        } catch (err: any) {
            setFormError('فشل الحفظ: ' + err.message);
        } finally { setFormLoading(false); }
    };

    // ===================== DELETE =====================
    const confirmDelete = async () => {
        if (supplierToDelete === null) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(API.delete(supplierToDelete), { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setSupplierToDelete(null); fetchSuppliers();
        } catch (err: any) {
            setError('فشل الحذف: ' + err.message); setSupplierToDelete(null);
        } finally { setDeleteLoading(false); }
    };

    // ===================== RENDER =====================
    return (
        <div className="p-4 space-y-4" dir={direction}>
            <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                <span>{t('home')}</span><span>/</span>
                <span className="text-[var(--text-main)] font-medium">{t('suppliers')}</span>
            </div>

            <div className="bg-[var(--bg-card)] p-4 rounded-t-2xl border border-[var(--border)] border-b-0 shadow-sm">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                        <Users size={20} className="text-[var(--primary)]" />{t('suppliers')}
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={fetchSuppliers} className="p-2 border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-gray-50 transition-colors" title="تحديث">
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={openAdd} className="btn-primary"><Plus size={20} />{t('add_supplier')}</button>
                    </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-1">{t('customize_report_below')}</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span>{error}</span><button onClick={() => setError(null)}><X size={16} /></button>
                </div>
            )}

            <div className="bg-[var(--bg-card)] rounded-b-2xl shadow-sm border border-[var(--border)] p-4 min-h-[400px]">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                            <span>{t('show')}</span>
                            <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="border border-[var(--border)] bg-[var(--input-bg)] rounded-lg px-3 py-1.5 outline-none focus:border-[var(--primary)] transition-all">
                                <option value={10}>10</option><option value={25}>25</option>
                                <option value={50}>50</option><option value={100}>100</option>
                            </select>
                        </div>
                        <div className="relative w-full md:w-80">
                            <input type="text" placeholder={t('search_placeholder')} value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className={`w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--primary)] transition-all ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`} />
                            <Search className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] ${direction === 'rtl' ? 'right-3' : 'left-3'}`} size={18} />
                        </div>
                    </div>

                    {loading && <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent" /></div>}

                    {!loading && (
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border)]">
                            <table className="takamol-table">
                                <thead>
                                    <tr>
                                        <th className="w-10"><input type="checkbox" className="rounded w-4 h-4 accent-white" checked={paginatedSuppliers.length > 0 && selectedSuppliers.length === paginatedSuppliers.length} onChange={toggleSelectAll} /></th>
                                        <th>{t('name')}</th>
                                        <th>{t('email_address')}</th>
                                        <th>{t('phone')}</th>
                                        <th>موبايل</th>
                                        <th>{t('tax_number')}</th>
                                        <th>المدينة</th>
                                        <th className="w-24 text-center">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSuppliers.length === 0 ? (
                                        <tr><td colSpan={8} className="p-8 text-center text-[var(--text-muted)] italic">{t('no_data_in_table')}</td></tr>
                                    ) : paginatedSuppliers.map((s) => (
                                        <tr key={s.id}>
                                            <td className="text-center"><input type="checkbox" checked={selectedSuppliers.includes(s.id)} onChange={() => toggleSelect(s.id)} className="w-4 h-4 accent-[var(--primary)]" /></td>
                                            <td className="font-bold text-[var(--text-main)]">{s.supplierName}</td>
                                            <td className="text-blue-600">{s.email || '-'}</td>
                                            <td>{s.phone || '-'}</td>
                                            <td>{s.mobile || '-'}</td>
                                            <td>{s.taxNumber || '-'}</td>
                                            <td>{s.city || '-'}</td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEdit(s)} className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all" title={t('edit')}><Edit2 size={16} /></button>
                                                    <button onClick={() => setSupplierToDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" title={t('delete')}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && (
                        <div className="md:hidden space-y-4">
                            {paginatedSuppliers.length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-muted)] italic bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">{t('no_data_in_table')}</div>
                            ) : paginatedSuppliers.map((s) => (
                                <MobileDataCard key={s.id} title={s.supplierName}
                                    fields={[
                                        { label: t('email_address'), value: s.email || '-' },
                                        { label: t('phone'), value: s.phone || '-' },
                                        { label: 'موبايل', value: s.mobile || '-' },
                                        { label: t('tax_number'), value: s.taxNumber || '-' },
                                        { label: 'المدينة', value: s.city || '-' },
                                    ]}
                                    actions={
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button onClick={() => openEdit(s)} className="btn-secondary !px-3 !py-1.5 !text-xs"><Edit2 size={14} />{t('edit')}</button>
                                            <button onClick={() => setSupplierToDelete(s.id)} className="btn-danger !px-3 !py-1.5 !text-xs"><Trash2 size={14} />{t('delete')}</button>
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSuppliers.length} itemsPerPage={entriesPerPage} onPageChange={setCurrentPage} />
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()} dir="rtl">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[var(--primary)]/5 shrink-0">
                            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                                <Users size={20} className="text-[var(--primary)]" />
                                {editingSupplier ? 'تعديل مورد' : 'إضافة مورد'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm flex justify-between">
                                    <span>{formError}</span><button onClick={() => setFormError(null)}><X size={14} /></button>
                                </div>
                            )}

                            {/* Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">اسم المورد <span className="text-red-500">*</span></label>
                                    <input type="text" value={form.supplierName} onChange={e => setForm(f => ({ ...f, supplierName: e.target.value }))} placeholder="اسم المورد" className="takamol-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="example@email.com" className="takamol-input" />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">هاتف</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="01xxxxxxxxx" className="takamol-input" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">موبايل</label>
                                    <input type="tel" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="01xxxxxxxxx" className="takamol-input" dir="ltr" />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">الرقم الضريبي</label>
                                    <input type="text" value={form.taxNumber} onChange={e => setForm(f => ({ ...f, taxNumber: e.target.value }))} placeholder="xxx-xxx-xxx" className="takamol-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">شروط الدفع (يوم)</label>
                                    <input type="number" value={form.paymentTerms} onChange={e => setForm(f => ({ ...f, paymentTerms: e.target.value }))} placeholder="30" className="takamol-input" />
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">العنوان</label>
                                <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="العنوان بالتفصيل" className="takamol-input" />
                            </div>

                            {/* Row 5 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">المدينة</label>
                                    <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="القاهرة" className="takamol-input !text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">المحافظة</label>
                                    <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="القاهرة" className="takamol-input !text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">الدولة</label>
                                    <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="مصر" className="takamol-input !text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">الرمز البريدي</label>
                                    <input type="text" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} placeholder="12345" className="takamol-input !text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-6 pt-2 flex gap-3 shrink-0 border-t border-gray-100">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
                            <button onClick={handleFormSubmit} disabled={formLoading}
                                className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                                {formLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : editingSupplier ? 'حفظ التعديلات' : 'إضافة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {supplierToDelete !== null && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSupplierToDelete(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl" onClick={e => e.stopPropagation()} dir="rtl">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={30} /></div>
                        <h2 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h2>
                        <p className="text-gray-500 mb-1 text-sm font-bold">{suppliers.find(s => s.id === supplierToDelete)?.supplierName}</p>
                        <p className="text-gray-400 mb-6 text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
                        <div className="flex gap-3">
                            <button onClick={() => setSupplierToDelete(null)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
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
}