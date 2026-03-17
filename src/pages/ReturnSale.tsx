import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X, Search, Upload, Trash2, Plus, Bold, Italic, List, CheckCircle, AlertCircle,
    RotateCcw, FileText, DollarSign // تم إضافة الأيقونات الناقصة هنا
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// بيانات وهمية لمحاكاة الفاتورة الأصلية والأصناف المتاحة
const MOCK_INVOICE_ITEMS = [
    { id: 1, code: '60990980', name: 'عباية كريب مع اكمام مموجه', unitPrice: 250.00, originalQty: 2, returnQty: 1, extraFees: 0 },
    { id: 2, code: '13032304', name: 'طرحة سوداء سادة', unitPrice: 50.00, originalQty: 1, returnQty: 0, extraFees: 0 },
];

const MOCK_PRODUCTS = [
    { id: 3, code: '75448610', name: 'منتج إضافي 1', unitPrice: 100 },
    { id: 4, code: '62870082', name: 'منتج إضافي 2', unitPrice: 150 },
];

export default function ReturnSale() {
    const { direction } = useLanguage();
    const navigate = useNavigate();

    // ==========================================
    // 1. States (حالة البيانات في الصفحة)
    // ==========================================
    const [formData, setFormData] = useState({
        date: new Date().toLocaleString('en-GB'),
        reference: 'RET-' + Math.floor(Math.random() * 100000),
        discount: 0,
        warehouse: 'المخزن الرئيسي',
        isFullReturn: false,
        paymentNote: '',
        returnNote: ''
    });

    const [items, setItems] = useState<any[]>([]);
    const [payments, setPayments] = useState([{ id: 1, method: 'mada', amount: 0, ref: '' }]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // ==========================================
    // 2. Calculations (الحسابات التلقائية الآمنة)
    // ==========================================
    const totals = useMemo(() => {
        // حماية (Number) عشان لو الحقل فاضي ميجيبش NaN ويضرب الصفحة
        const itemsTotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) * Number(item.returnQty)) + Number(item.extraFees || 0), 0);
        const finalTotal = itemsTotal - Number(formData.discount || 0);
        const paymentsTotal = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

        return {
            itemsCount: items.reduce((sum, item) => sum + Number(item.returnQty || 0), 0),
            subTotal: itemsTotal,
            finalTotal: finalTotal > 0 ? finalTotal : 0,
            paymentsTotal: paymentsTotal,
            balance: (finalTotal > 0 ? finalTotal : 0) - paymentsTotal
        };
    }, [items, formData.discount, payments]);

    // ==========================================
    // 3. Handlers (الوظائف والأزرار)
    // ==========================================

    const handleFullReturnToggle = (checked: boolean) => {
        setFormData({ ...formData, isFullReturn: checked });
        if (checked) {
            const fullItems = MOCK_INVOICE_ITEMS.map(item => ({ ...item, returnQty: item.originalQty }));
            setItems(fullItems);
            const total = fullItems.reduce((sum, item) => sum + (Number(item.unitPrice) * Number(item.originalQty)), 0);
            setPayments([{ id: 1, method: 'mada', amount: total, ref: '' }]);
        } else {
            setItems([]);
            setPayments([{ id: 1, method: 'mada', amount: 0, ref: '' }]);
        }
    };

    const handleAddItem = (product: any) => {
        const existing = items.find(i => i.id === product.id);
        if (existing) {
            setItems(items.map(i => i.id === product.id ? { ...i, returnQty: i.returnQty + 1 } : i));
        } else {
            setItems([...items, { ...product, returnQty: 1, extraFees: 0, originalQty: 99 }]);
        }
        setSearchTerm('');
        setShowDropdown(false);
    };

    const handleItemChange = (id: number, field: string, value: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                let finalValue = isNaN(value) ? 0 : value;
                if (field === 'returnQty' && finalValue > item.originalQty) finalValue = item.originalQty;
                if (field === 'returnQty' && finalValue < 0) finalValue = 0;
                return { ...item, [field]: finalValue };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleAddPayment = () => {
        const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
        setPayments([...payments, { id: newId, method: 'cash', amount: totals.balance > 0 ? totals.balance : 0, ref: '' }]);
    };

    const handlePaymentChange = (id: number, field: string, value: any) => {
        setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleRemovePayment = (id: number) => {
        setPayments(payments.filter(p => p.id !== id));
    };

    const insertFormatting = (tag: string, field: 'paymentNote' | 'returnNote') => {
        setFormData(prev => ({ ...prev, [field]: prev[field] + ` ${tag} ` }));
    };

    const handleSubmit = () => {
        if (items.length === 0) {
            alert('لا يمكن إتمام العملية: الرجاء إضافة أصناف للإرجاع.');
            return;
        }
        if (Math.abs(totals.balance) > 0.1) {
            alert(`لا يمكن إتمام العملية: مبالغ الدفع (${totals.paymentsTotal}) لا تتطابق مع إجمالي المرتجع (${totals.finalTotal}).`);
            return;
        }
        alert('تم حفظ مرتجع المبيعات بنجاح!');
        navigate('/sales/all');
    };

    return (
        <div className="space-y-6 pb-24" dir={direction}>

            {/* هيدر الصفحة */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4">
                <div className="flex items-center gap-2">
                    <div className="bg-red-50 p-2 rounded-lg text-red-600">
                        <RotateCcw size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">إرجاع البيع</h1>
                        <p className="text-xs text-gray-500 font-bold">فاتورة أصلية رقم: #506</p>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors border border-gray-200">
                    <X size={20} />
                </button>
            </div>

            {/* كارت 1: المعلومات الأساسية */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={18} className="text-[#00a651]" />
                    المعلومات الأساسية للمرتجع
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">التاريخ *</label>
                            <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="takamol-input bg-gray-50 text-center font-mono" dir="ltr" readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">الرقم المرجعي</label>
                            <input type="text" value={formData.reference} onChange={e => setFormData({ ...formData, reference: e.target.value })} className="takamol-input font-bold text-[#00a651]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">الخصم على المرتجع</label>
                            <div className="relative">
                                <input type="number" value={formData.discount || ''} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="takamol-input text-center pl-8" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">SAR</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">المرفقات</label>
                            <div className="flex h-[42px]">
                                <input type="text" placeholder="اختر ملف..." readOnly className="flex-1 border border-gray-300 border-l-0 rounded-r-lg px-3 text-sm outline-none bg-gray-50" />
                                <button className="bg-[#00a651] hover:bg-[#008f45] text-white px-4 rounded-l-lg text-sm font-bold flex items-center justify-center transition-colors">
                                    <Upload size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                checked={formData.isFullReturn}
                                onChange={(e) => handleFullReturnToggle(e.target.checked)}
                            />
                            <span className="text-sm font-bold text-blue-900">إرجاع كامل الفاتورة (تحديد الكل)</span>
                        </label>
                        <button
                            onClick={() => handleFullReturnToggle(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                            تحميل أصناف الفاتورة الأصلية
                        </button>
                    </div>
                </div>
            </div>

            {/* كارت 2: الأصناف المرتجعة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                        <List size={18} className="text-[#00a651]" />
                        أصناف المرتجع
                    </span>

                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="ابحث لإضافة صنف يدوي..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                            onFocus={() => setShowDropdown(true)}
                            className="takamol-input !py-1.5 !text-sm !pr-8"
                        />
                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

                        {showDropdown && searchTerm && (
                            <div className="absolute top-full mt-1 right-0 w-full bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-48 overflow-y-auto">
                                {MOCK_PRODUCTS.filter(p => p.name.includes(searchTerm) || p.code.includes(searchTerm)).map(p => (
                                    <button key={p.id} onClick={() => handleAddItem(p)} className="w-full text-right p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-sm font-bold">
                                        {p.code} - {p.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm">
                        <thead className="bg-[#00a651] text-white">
                            <tr>
                                <th className="p-3 w-12 border-l border-white/20"><Trash2 size={16} className="mx-auto" /></th>
                                <th className="p-3 border-l border-white/20 text-right">الصنف (الكود)</th>
                                <th className="p-3 border-l border-white/20 w-28">سعر الوحدة</th>
                                <th className="p-3 border-l border-white/20 w-32">كمية الإرجاع</th>
                                <th className="p-3 border-l border-white/20 w-32">رسوم إضافية</th>
                                <th className="p-3 w-32">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle size={32} className="text-gray-300" />
                                            <span className="font-bold text-gray-500">لا توجد أصناف مضافة للإرجاع</span>
                                            <span className="text-xs">استخدم زر "إرجاع كامل الفاتورة" أو ابحث عن صنف.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-2 border-l border-gray-100">
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors mx-auto block">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                        <td className="p-3 border-l border-gray-100 text-right font-bold text-gray-800">
                                            {item.code} - {item.name}
                                            <div className="text-xs text-gray-400 font-normal mt-1">الكمية في الفاتورة: {item.originalQty}</div>
                                        </td>
                                        <td className="p-2 border-l border-gray-100">
                                            <input type="number" value={item.unitPrice || ''} onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-center focus:border-[#00a651] outline-none" />
                                        </td>
                                        <td className="p-2 border-l border-gray-100">
                                            <input type="number" value={item.returnQty || ''} max={item.originalQty} min={0} onChange={e => handleItemChange(item.id, 'returnQty', Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-center font-bold text-lg text-blue-600 focus:border-[#00a651] outline-none bg-blue-50/30" />
                                        </td>
                                        <td className="p-2 border-l border-gray-100">
                                            <input type="number" value={item.extraFees || ''} onChange={e => handleItemChange(item.id, 'extraFees', Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-center focus:border-[#00a651] outline-none text-red-600" />
                                        </td>
                                        <td className="p-3 font-bold text-lg text-[#00a651] bg-[#e6f4ea]/30">
                                            {((Number(item.unitPrice) * Number(item.returnQty)) + Number(item.extraFees)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold text-gray-800 border-t-2 border-gray-300">
                            <tr>
                                <td colSpan={3} className="p-4 text-right">إجمالي كمية المرتجع: <span className="text-blue-600 ml-1 text-lg">{totals.itemsCount}</span></td>
                                <td colSpan={2} className="p-4 text-left">الإجمالي النهائي للمرتجع:</td>
                                <td className="p-4 text-center text-xl text-[#00a651] bg-[#00a651]/10">{(totals.finalTotal || 0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* كارت 3: المدفوعات */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/50 p-4 border-b border-gray-100 font-bold text-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-[#00a651]" />
                        طرق إرجاع المبلغ للعميل
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold ${Math.abs(totals.balance) < 0.1 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        {Math.abs(totals.balance) < 0.1 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        المتبقي: {Math.abs(totals.balance || 0).toFixed(2)}
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {payments.map((payment) => (
                        <div key={payment.id} className="flex flex-col md:flex-row items-end gap-4 p-4 border border-gray-200 rounded-lg relative bg-gray-50/30">
                            {payments.length > 1 && (
                                <button onClick={() => handleRemovePayment(payment.id)} className="absolute top-2 left-2 p-1.5 text-red-500 hover:bg-red-50 rounded">
                                    <X size={16} />
                                </button>
                            )}

                            <div className="w-full md:w-1/4 space-y-2">
                                <label className="text-xs font-bold text-gray-600">طريقة الدفع</label>
                                <select value={payment.method} onChange={e => handlePaymentChange(payment.id, 'method', e.target.value)} className="takamol-input font-bold bg-white">
                                    <option value="cash">نقداً</option>
                                    <option value="mada">شبكة (مدى)</option>
                                    <option value="bank">تحويل بنكي</option>
                                </select>
                            </div>
                            <div className="w-full md:w-1/4 space-y-2">
                                <label className="text-xs font-bold text-gray-600">المبلغ</label>
                                <input type="number" value={payment.amount || ''} onChange={e => handlePaymentChange(payment.id, 'amount', Number(e.target.value))} className="takamol-input font-bold text-lg text-center" />
                            </div>
                            <div className="w-full md:w-2/4 space-y-2">
                                <label className="text-xs font-bold text-gray-600">الرقم المرجعي للدفع (اختياري)</label>
                                <input type="text" value={payment.ref} onChange={e => handlePaymentChange(payment.id, 'ref', e.target.value)} placeholder="مثال: رقم التحويل" className="takamol-input" />
                            </div>
                        </div>
                    ))}

                    <button onClick={handleAddPayment} className="text-[#00a651] font-bold text-sm flex items-center gap-1 hover:underline p-2">
                        <Plus size={16} /> إضافة طريقة دفع أخرى
                    </button>
                </div>
            </div>

            {/* كارت 4: الملاحظات والإرسال */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">ملاحظة الدفع</label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 justify-end" dir="ltr">
                                <button onClick={() => insertFormatting('**BOLD**', 'paymentNote')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold size={14} /></button>
                                <button onClick={() => insertFormatting('*ITALIC*', 'paymentNote')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic size={14} /></button>
                                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List size={14} /></button>
                            </div>
                            <textarea value={formData.paymentNote} onChange={e => setFormData({ ...formData, paymentNote: e.target.value })} className="w-full p-3 h-24 outline-none resize-none bg-white text-sm" placeholder="ملاحظات تظهر في إيصال الدفع..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">ملاحظة الإرجاع (تظهر للعميل)</label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 justify-end" dir="ltr">
                                <button onClick={() => insertFormatting('**BOLD**', 'returnNote')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold size={14} /></button>
                                <button onClick={() => insertFormatting('*ITALIC*', 'returnNote')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic size={14} /></button>
                                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List size={14} /></button>
                            </div>
                            <textarea value={formData.returnNote} onChange={e => setFormData({ ...formData, returnNote: e.target.value })} className="w-full p-3 h-24 outline-none resize-none bg-white text-sm" placeholder="أسباب الإرجاع أو شروط الضمان..." />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        className={`px-12 py-3.5 rounded-xl font-bold text-lg shadow-md transition-all flex items-center gap-2 ${items.length > 0 && Math.abs(totals.balance) < 0.1
                                ? 'bg-[#00a651] hover:bg-[#008f45] text-white active:scale-95'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        إتمام عملية الإرجاع
                        <CheckCircle size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}