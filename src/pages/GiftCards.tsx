import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Gift, Plus, Trash2, Search, Edit2, Eye, Loader2, AlertTriangle, X, Settings, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useGetGiftCards } from "@/features/gift-cards/hooks/useGetGiftCards";
import { useGetGiftCardById } from "@/features/gift-cards/hooks/useGetGiftCardById";
import { useCreateGiftCard } from "@/features/gift-cards/hooks/useCreateGiftCard";
import { useUpdateGiftCard } from "@/features/gift-cards/hooks/useUpdateGiftCard";
import { useDeleteGiftCard } from "@/features/gift-cards/hooks/useDeleteGiftCard";
import type { GiftCardApi, GiftCardRow } from "@/features/gift-cards/types/giftCard.types";
import { httpClient } from "@/api/httpClient";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";

interface CustomerApi {
  id: number;
  customerName: string;
}

type ToastType = "success" | "error" | "warning";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles: Record<ToastType, string> = {
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600",
  };

  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : AlertCircle;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border ${styles[type]}`} style={{ minWidth: 280 }}>
      <Icon size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="mr-auto opacity-70 hover:opacity-100 text-lg leading-none">
        ×
      </button>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-right" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={22} className="text-red-500 shrink-0" />
          <p className="font-bold text-gray-800 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50">
            إلغاء
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700">
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDateForDisplay(date?: string | null) {
  if (!date) return "-";
  const p = new Date(date);
  return Number.isNaN(p.getTime()) ? date : p.toLocaleDateString("en-GB");
}

function toInputDate(date?: string | null) {
  if (!date) return "";
  const p = new Date(date);
  return Number.isNaN(p.getTime()) ? "" : p.toISOString().split("T")[0];
}

function extractError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.title || "حدث خطأ";
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ";
}

function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٬,]/g, "")
    .replace(/٫/g, ".")
    .trim();
}

interface FormModalProps {
  mode: "add" | "edit" | "view";
  card?: GiftCardRow | null;
  customers: CustomerApi[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export default function GiftCards() {
  const { direction, t } = useLanguage();

  const { data: giftCards = [], isLoading, refetch } = useGetGiftCards();
  const deleteMutation = useDeleteGiftCard();

  const [customers, setCustomers] = useState<CustomerApi[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [modal, setModal] = useState<{
    mode: "add" | "edit" | "view";
    card?: GiftCardRow;
  } | null>(null);
  const [confirm, setConfirm] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    httpClient<CustomerApi[]>("/Customer", { method: "GET" })
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, itemsPerPage]);

  async function handleDelete(id: number) {
    try {
      await deleteMutation.mutateAsync(id);
      showToast("تم حذف كارت الهدية بنجاح", "success");
    } catch (err) {
      showToast(extractError(err), "error");
    }
  }

  // const filtered = useMemo(() => {
  //   const q = searchTerm.trim().toLowerCase();
  //   if (!q) return giftCards;

  //   return giftCards.filter((c) => `${c.cardNumber} ${c.value} ${c.balance} ${c.customer} ${c.notes} ${c.expiryDate}`.toLowerCase().includes(q));
  // }, [giftCards, searchTerm]);

  // const totalCount = filtered.length;
  // const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  // const safePage = Math.min(page, totalPages);

  // const paginated = useMemo(() => filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage), [filtered, safePage, itemsPerPage]);
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" value={globalFilterValue} placeholder={t("search_placeholder") || "البحث..."} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    // <div className="space-y-4" dir={direction}>
    //   {toast && (
    //     <Toast
    //       message={toast.message}
    //       type={toast.type}
    //       onClose={() => setToast(null)}
    //     />
    //   )}

    //   {confirm && (
    //     <ConfirmModal
    //       message={confirm.message}
    //       onConfirm={() => {
    //         confirm.onConfirm();
    //         setConfirm(null);
    //       }}
    //       onCancel={() => setConfirm(null)}
    //     />
    //   )}

    //   {modal && (
    //     <FormModal
    //       mode={modal.mode}
    //       card={modal.card}
    //       customers={customers}
    //       onClose={() => setModal(null)}
    //       onSuccess={(msg) => {
    //         showToast(msg, 'success');
    //         refetch();
    //       }}
    //     />
    //   )}

    //   <div className="takamol-page-header">
    //     <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
    //       <h1 className="takamol-page-title flex items-center gap-2">
    //         <Gift size={24} className="text-[var(--primary)]" />
    //         <span>{t('gift_cards')}</span>
    //       </h1>
    //       <p className="takamol-page-subtitle">إدارة وتتبع كروت الهدايا</p>
    //     </div>

    //     <div className="flex flex-wrap gap-2">
    //       <button
    //         onClick={() => setModal({ mode: 'add' })}
    //         className="btn-primary"
    //       >
    //         <Plus size={20} /> إضافة كارت هدية
    //       </button>
    //     </div>
    //   </div>

    //   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
    //     <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
    //       <div className="relative w-full md:w-72">
    //         <input
    //           type="text"
    //           placeholder="بحث برقم الكارت أو العميل أو القيمة..."
    //           value={searchTerm}
    //           onChange={(e) => setSearchTerm(e.target.value)}
    //           className="takamol-input !py-2"
    //         />
    //         <Search
    //           className={cn(
    //             'absolute top-1/2 -translate-y-1/2 text-gray-400',
    //             direction === 'rtl' ? 'left-3' : 'right-3'
    //           )}
    //           size={18}
    //         />
    //       </div>

    //       <div className="flex items-center gap-2 text-sm font-bold text-gray-700 w-full md:w-auto justify-end">
    //         <span>اظهر</span>
    //         <select
    //           className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
    //           value={itemsPerPage}
    //           onChange={(e) => setItemsPerPage(Number(e.target.value))}
    //         >
    //           <option value={10}>10</option>
    //           <option value={25}>25</option>
    //           <option value={50}>50</option>
    //         </select>
    //         <button
    //           onClick={() => refetch()}
    //           className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5"
    //         >
    //           تحديث
    //         </button>
    //       </div>
    //     </div>

    //     <div className="hidden md:block overflow-x-auto">
    //       <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    //         <table className="takamol-table mb-0 min-w-[900px]">
    //           <thead>
    //             <tr>
    //               <th>رقم الكارت</th>
    //               <th className="text-center">القيمة</th>
    //               <th className="text-center">الرصيد</th>
    //               <th>العميل</th>
    //               <th>مدخل البيانات</th>
    //               <th className="text-center">تاريخ الانتهاء</th>
    //               <th>ملاحظات</th>
    //               <th className="w-32 text-center">الإجراءات</th>
    //             </tr>
    //           </thead>

    //           <tbody>
    //             {isLoading ? (
    //               <tr>
    //                 <td colSpan={8} className="text-center py-10">
    //                   <div className="flex items-center justify-center gap-2 text-gray-500">
    //                     <Loader2 size={18} className="animate-spin" />
    //                     <span>جاري التحميل...</span>
    //                   </div>
    //                 </td>
    //               </tr>
    //             ) : paginated.length > 0 ? (
    //               paginated.map((card) => (
    //                 <tr key={card.id}>
    //                   <td className="font-bold text-gray-800">{card.cardNumber}</td>
    //                   <td className="text-center font-medium">{card.value.toFixed(2)}</td>
    //                   <td className="text-center font-medium">{card.balance.toFixed(2)}</td>
    //                   <td className="text-gray-600">{card.customer}</td>
    //                   <td className="text-gray-600">{card.dataEntry}</td>
    //                   <td className="text-center text-gray-600">{card.expiryDate}</td>
    //                   <td className="text-gray-500 text-xs max-w-[120px] truncate">
    //                     {card.notes || '-'}
    //                   </td>
    //                   <td className="text-center">
    //                     <div className="flex items-center justify-center gap-1">
    //                       <button
    //                         onClick={() => setModal({ mode: 'view', card })}
    //                         className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
    //                         title="عرض"
    //                       >
    //                         <Eye size={15} />
    //                       </button>
    //                       <button
    //                         onClick={() => setModal({ mode: 'edit', card })}
    //                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
    //                         title="تعديل"
    //                       >
    //                         <Edit2 size={15} />
    //                       </button>
    //                       <button
    //                         onClick={() =>
    //                           setConfirm({
    //                             message: `هل أنت متأكد من حذف الكارت "${card.cardNumber}"؟`,
    //                             onConfirm: () => handleDelete(card.id),
    //                           })
    //                         }
    //                         className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
    //                         title="حذف"
    //                       >
    //                         <Trash2 size={15} />
    //                       </button>
    //                     </div>
    //                   </td>
    //                 </tr>
    //               ))
    //             ) : (
    //               <tr>
    //                 <td colSpan={8} className="text-center py-8 text-gray-500 font-bold">
    //                   لا توجد كروت هدايا، قم بإضافة كارت جديد.
    //                 </td>
    //               </tr>
    //             )}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>

    //     <div className="md:hidden space-y-3">
    //       {isLoading ? (
    //         <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
    //           <Loader2 size={18} className="animate-spin" />
    //           <span>جاري التحميل...</span>
    //         </div>
    //       ) : paginated.length > 0 ? (
    //         paginated.map((card) => (
    //           <div
    //             key={card.id}
    //             className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-2"
    //           >
    //             <div className="flex justify-between items-center">
    //               <span className="font-bold text-gray-800 text-sm">{card.cardNumber}</span>
    //             </div>

    //             <div className="grid grid-cols-2 gap-2 text-xs">
    //               <div>
    //                 <span className="text-gray-400">القيمة: </span>
    //                 <span className="font-bold">{card.value.toFixed(2)}</span>
    //               </div>
    //               <div>
    //                 <span className="text-gray-400">الرصيد: </span>
    //                 <span className="font-bold">{card.balance.toFixed(2)}</span>
    //               </div>
    //               <div>
    //                 <span className="text-gray-400">العميل: </span>
    //                 <span>{card.customer}</span>
    //               </div>
    //               <div>
    //                 <span className="text-gray-400">الانتهاء: </span>
    //                 <span>{card.expiryDate}</span>
    //               </div>
    //             </div>

    //             <div className="flex gap-2 pt-1 border-t border-gray-100">
    //               <button
    //                 onClick={() => setModal({ mode: 'view', card })}
    //                 className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs font-bold"
    //               >
    //                 عرض
    //               </button>
    //               <button
    //                 onClick={() => setModal({ mode: 'edit', card })}
    //                 className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-xs font-bold"
    //               >
    //                 تعديل
    //               </button>
    //               <button
    //                 onClick={() =>
    //                   setConfirm({
    //                     message: `حذف "${card.cardNumber}"؟`,
    //                     onConfirm: () => handleDelete(card.id),
    //                   })
    //                 }
    //                 className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-bold"
    //               >
    //                 حذف
    //               </button>
    //             </div>
    //           </div>
    //         ))
    //       ) : (
    //         <div className="text-center py-8 text-gray-500 font-bold">لا توجد كروت هدايا.</div>
    //       )}
    //     </div>

    //     <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 pt-4">
    //       <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
    //         <button
    //           disabled={safePage >= totalPages}
    //           onClick={() => setPage((p) => p + 1)}
    //           className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm disabled:opacity-50"
    //         >
    //           <ArrowRight className="w-4 h-4" /> التالي
    //         </button>

    //         <button className="px-4 py-2 bg-[#2ecc71] text-white font-bold text-sm border-l border-gray-200">
    //           {safePage}
    //         </button>

    //         <button
    //           disabled={safePage <= 1}
    //           onClick={() => setPage((p) => p - 1)}
    //           className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm disabled:opacity-50"
    //         >
    //           سابق <ArrowLeft className="w-4 h-4" />
    //         </button>
    //       </div>

    //       <div className="text-sm font-bold text-gray-500">إجمالي السجلات: {totalCount}</div>
    //     </div>
    //   </div>
    // </div>
    <Card>
      <CardHeader>
        <CardTitle>إدارة المشتريات </CardTitle>
        <CardDescription>إدارة المشتريات </CardDescription>
        <CardAction>
          <Button variant={"default"}>إضافة فاتورة مشتريات </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={giftCards}
          totalRecords={giftCards?.length}
          loading={!giftCards}
          rowsPerPageOptions={[5, 10, 20, 50]}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          header={renderHeader}
          responsiveLayout="stack"
          className="custom-green-table custom-compact-table"
          dataKey="id"
        >
          <Column header={"رقم الكارت"} sortable field="" />
          <Column header={"رقم الفاتورة"} field="purchaseOrderNumber" sortable />
          <Column header={"اسم المورد"} field="supplierName" sortable />
          <Column header={"حالة عملية الشراء"} field="orderStatus" sortable />
          <Column
            header={t("actions")}
            body={(purchase) => (
              <div className="space-x-2">
                <Link to={`/purchases/edit/${purchase?.id}`} onClick={async () => {}} className="btn-minimal-action btn-edit">
                  <Edit2 size={16} />
                </Link>
                <button onClick={async () => {}} className="btn-minimal-action btn-delete">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </DataTable>
      </CardContent>
    </Card>
  );
}
