import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  Search,
  Edit2,
  Eye,
  Loader2,
  AlertTriangle,
  X,
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useGetGiftCards } from '@/features/gift-cards/hooks/useGetGiftCards';
import { useGetGiftCardById } from '@/features/gift-cards/hooks/useGetGiftCardById';
import { useCreateGiftCard } from '@/features/gift-cards/hooks/useCreateGiftCard';
import { useUpdateGiftCard } from '@/features/gift-cards/hooks/useUpdateGiftCard';
import { useDeleteGiftCard } from '@/features/gift-cards/hooks/useDeleteGiftCard';
import type { GiftCardApi, GiftCardRow } from '@/features/gift-cards/types/giftCard.types';
import { httpClient } from '@/api/httpClient';

interface CustomerApi {
  id: number;
  customerName: string;
}

type ToastType = 'success' | 'error' | 'warning';

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles: Record<ToastType, string> = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    warning: 'bg-yellow-500 border-yellow-600',
  };

  const Icon =
    type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border ${styles[type]}`}
      style={{ minWidth: 280 }}
    >
      <Icon size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
      <button
        onClick={onClose}
        className="mr-auto opacity-70 hover:opacity-100 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-right" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={22} className="text-red-500 shrink-0" />
          <p className="font-bold text-gray-800 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDateForDisplay(date?: string | null) {
  if (!date) return '-';
  const p = new Date(date);
  return Number.isNaN(p.getTime()) ? date : p.toLocaleDateString('en-GB');
}

function toInputDate(date?: string | null) {
  if (!date) return '';
  const p = new Date(date);
  return Number.isNaN(p.getTime()) ? '' : p.toISOString().split('T')[0];
}

function extractError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.title || 'حدث خطأ';
  }
  if (error instanceof Error) return error.message;
  return 'حدث خطأ';
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٬,]/g, '')
    .replace(/٫/g, '.')
    .trim();
}

const mapApiToRow = (item: GiftCardApi): GiftCardRow => ({
  id: item.id,
  cardNumber: item.code ?? '',
  value: Number(item.initialAmount ?? 0),
  balance: Number(item.remainingAmount ?? 0),
  dataEntry: item.createdByName || '-',
  notes: item.notes || '',
  customer: item.customer?.customerName || '-',
  customerId: item.customerId ?? '',
  expiryDate: formatDateForDisplay(item.expiryDate),
  createdAt: item.createdAt,
  isActive: item.isActive,
});

interface FormModalProps {
  mode: 'add' | 'edit' | 'view';
  card?: GiftCardRow | null;
  customers: CustomerApi[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

function FormModal({ mode, card, customers, onClose, onSuccess }: FormModalProps) {
  const createMutation = useCreateGiftCard();
  const updateMutation = useUpdateGiftCard();

  const { data: fullCard, isLoading: loadingCard } = useGetGiftCardById(
    mode !== 'add' && card?.id ? card.id : undefined
  );

  const [formData, setFormData] = useState({
    cardNumber: '',
    value: '',
    customer: '',
    expiryDate: '',
    notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (fullCard) {
      setFormData({
        cardNumber: fullCard.code || '',
        value: String(fullCard.initialAmount ?? ''),
        customer: fullCard.customerId ? String(fullCard.customerId) : '',
        expiryDate: toInputDate(fullCard.expiryDate),
        notes: fullCard.notes || '',
      });
    }
  }, [fullCard]);

  function generateCardNumber() {
    setFormData((p) => ({
      ...p,
      cardNumber: `GC-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    }));
  }

  async function handleSubmit() {
    const normalizedValue = normalizeDigits(formData.value);
    const value = Number(normalizedValue);

    if (!formData.cardNumber.trim()) {
      setError('رقم الكارت مطلوب');
      return;
    }

    if (!normalizedValue || Number.isNaN(value) || value <= 0) {
      setError('القيمة يجب أن تكون رقم صحيح أكبر من صفر');
      return;
    }

    setError('');

    try {
      if (mode === 'add') {
        const createPayload = {
          code: formData.cardNumber.trim(),
          amount: value,
          initialAmount: value,
          remainingAmount: value,
          customerId: formData.customer ? Number(formData.customer) : 0,
          expiryDate: formData.expiryDate
            ? new Date(formData.expiryDate).toISOString()
            : null,
          notes: formData.notes.trim(),
          isActive: true,
        } as any;

        await createMutation.mutateAsync(createPayload);
        onSuccess('تم إضافة كارت الهدية بنجاح');
      } else if (mode === 'edit' && card) {
        const updatePayload = {
          id: card.id,
          code: formData.cardNumber.trim(),
          initialAmount: value,
          remainingAmount: Number(fullCard?.remainingAmount ?? value),
          customerId: formData.customer ? Number(formData.customer) : null,
          expiryDate: formData.expiryDate
            ? new Date(formData.expiryDate).toISOString()
            : null,
          notes: formData.notes.trim(),
          isActive: true,
        };

        await updateMutation.mutateAsync(updatePayload);
        onSuccess('تم تعديل كارت الهدية بنجاح');
      }

      onClose();
    } catch (err) {
      setError(extractError(err));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;
  const title =
    mode === 'add'
      ? 'إضافة كارت هدية'
      : mode === 'edit'
      ? 'تعديل كارت هدية'
      : 'تفاصيل كارت الهدية';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Gift size={18} className="text-[#2ecc71]" /> {title}
          </h2>
        </div>

        <div className="p-6 space-y-4" dir="rtl">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-bold flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')}>
                <X size={14} />
              </button>
            </div>
          )}

          {loadingCard ? (
            <div className="py-10 flex items-center justify-center gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              <span>جارٍ تحميل البيانات...</span>
            </div>
          ) : mode === 'view' ? (
            <div className="space-y-3">
              {[
                { label: 'رقم الكارت', value: formData.cardNumber },
                { label: 'القيمة', value: formData.value },
                {
                  label: 'العميل',
                  value:
                    customers.find((c) => String(c.id) === formData.customer)
                      ?.customerName || '-',
                },
                {
                  label: 'تاريخ الانتهاء',
                  value: formData.expiryDate
                    ? formatDateForDisplay(formData.expiryDate)
                    : '-',
                },
                { label: 'الملاحظات', value: formData.notes || '-' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center border border-gray-100 rounded-xl p-3"
                >
                  <span className="text-sm text-gray-500 font-medium">{label}</span>
                  <span className="text-sm font-bold text-gray-800">{value}</span>
                </div>
              ))}

              <button
                onClick={onClose}
                className="w-full bg-gray-600 text-white py-2.5 rounded-lg font-bold hover:bg-gray-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  رقم الكارت *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generateCardNumber}
                    className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="توليد تلقائي"
                  >
                    <Settings size={18} />
                  </button>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, cardNumber: e.target.value }))
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2ecc71] text-right"
                    placeholder="GC-XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  القيمة *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      value: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2ecc71] text-right"
                  placeholder="أدخل القيمة"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  العميل
                </label>
                <select
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, customer: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2ecc71] bg-white text-right"
                >
                  <option value="">اختر عميل</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  تاريخ الانتهاء
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, expiryDate: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2ecc71] text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2ecc71] h-20 text-right resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-[#2ecc71] text-white py-2.5 rounded-lg font-bold hover:bg-[#27ae60] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <span>
                    {saving
                      ? 'جاري الحفظ...'
                      : mode === 'edit'
                      ? 'حفظ التعديلات'
                      : 'إضافة الكارت'}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg font-bold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GiftCards() {
  const { direction, t } = useLanguage();

  const { data: rawCards = [], isLoading, refetch } = useGetGiftCards();
  const deleteMutation = useDeleteGiftCard();

  const [customers, setCustomers] = useState<CustomerApi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null
  );
  const [modal, setModal] = useState<{
    mode: 'add' | 'edit' | 'view';
    card?: GiftCardRow;
  } | null>(null);
  const [confirm, setConfirm] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const giftCards = useMemo(
    () => rawCards.filter((i) => !i.isDeleted).map(mapApiToRow),
    [rawCards]
  );

  useEffect(() => {
    httpClient<CustomerApi[]>('/Customer', { method: 'GET' })
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, itemsPerPage]);

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id);
      showToast('تم حذف كارت الهدية بنجاح', 'success');
    } catch (err) {
      showToast(extractError(err), 'error');
    }
  }

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return giftCards;

    return giftCards.filter((c) =>
      `${c.cardNumber} ${c.value} ${c.balance} ${c.customer} ${c.notes} ${c.expiryDate}`
        .toLowerCase()
        .includes(q)
    );
  }, [giftCards, searchTerm]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage),
    [filtered, safePage, itemsPerPage]
  );

  return (
    <div className="space-y-4" dir={direction}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={() => {
            confirm.onConfirm();
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {modal && (
        <FormModal
          mode={modal.mode}
          card={modal.card}
          customers={customers}
          onClose={() => setModal(null)}
          onSuccess={(msg) => {
            showToast(msg, 'success');
            refetch();
          }}
        />
      )}

      <div className="takamol-page-header">
        <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
          <h1 className="takamol-page-title flex items-center gap-2">
            <Gift size={24} className="text-[var(--primary)]" />
            <span>{t('gift_cards')}</span>
          </h1>
          <p className="takamol-page-subtitle">إدارة وتتبع كروت الهدايا</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="btn-primary"
          >
            <Plus size={20} /> إضافة كارت هدية
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="بحث برقم الكارت أو العميل أو القيمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="takamol-input !py-2"
            />
            <Search
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-gray-400',
                direction === 'rtl' ? 'left-3' : 'right-3'
              )}
              size={18}
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 w-full md:w-auto justify-end">
            <span>اظهر</span>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <button
              onClick={() => refetch()}
              className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5"
            >
              تحديث
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="takamol-table mb-0 min-w-[900px]">
              <thead>
                <tr>
                  <th>رقم الكارت</th>
                  <th className="text-center">القيمة</th>
                  <th className="text-center">الرصيد</th>
                  <th>العميل</th>
                  <th>مدخل البيانات</th>
                  <th className="text-center">تاريخ الانتهاء</th>
                  <th>ملاحظات</th>
                  <th className="w-32 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                        <span>جاري التحميل...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length > 0 ? (
                  paginated.map((card) => (
                    <tr key={card.id}>
                      <td className="font-bold text-gray-800">{card.cardNumber}</td>
                      <td className="text-center font-medium">{card.value.toFixed(2)}</td>
                      <td className="text-center font-medium">{card.balance.toFixed(2)}</td>
                      <td className="text-gray-600">{card.customer}</td>
                      <td className="text-gray-600">{card.dataEntry}</td>
                      <td className="text-center text-gray-600">{card.expiryDate}</td>
                      <td className="text-gray-500 text-xs max-w-[120px] truncate">
                        {card.notes || '-'}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setModal({ mode: 'view', card })}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                            title="عرض"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ mode: 'edit', card })}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="تعديل"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setConfirm({
                                message: `هل أنت متأكد من حذف الكارت "${card.cardNumber}"؟`,
                                onConfirm: () => handleDelete(card.id),
                              })
                            }
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500 font-bold">
                      لا توجد كروت هدايا، قم بإضافة كارت جديد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
              <Loader2 size={18} className="animate-spin" />
              <span>جاري التحميل...</span>
            </div>
          ) : paginated.length > 0 ? (
            paginated.map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">{card.cardNumber}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">القيمة: </span>
                    <span className="font-bold">{card.value.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">الرصيد: </span>
                    <span className="font-bold">{card.balance.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">العميل: </span>
                    <span>{card.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">الانتهاء: </span>
                    <span>{card.expiryDate}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => setModal({ mode: 'view', card })}
                    className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs font-bold"
                  >
                    عرض
                  </button>
                  <button
                    onClick={() => setModal({ mode: 'edit', card })}
                    className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-xs font-bold"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() =>
                      setConfirm({
                        message: `حذف "${card.cardNumber}"؟`,
                        onConfirm: () => handleDelete(card.id),
                      })
                    }
                    className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-bold"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 font-bold">لا توجد كروت هدايا.</div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 pt-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" /> التالي
            </button>

            <button className="px-4 py-2 bg-[#2ecc71] text-white font-bold text-sm border-l border-gray-200">
              {safePage}
            </button>

            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm disabled:opacity-50"
            >
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm font-bold text-gray-500">إجمالي السجلات: {totalCount}</div>
        </div>
      </div>
    </div>
  );
}