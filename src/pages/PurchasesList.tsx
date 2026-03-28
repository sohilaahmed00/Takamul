import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, FileText, LayoutGrid, ChevronRight, ChevronLeft, Filter, ArrowUpDown, CheckSquare, Square, Plus, Edit2, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PurchaseStatus, PaymentStatus } from "@/types";
import { usePurchases } from "@/context/PurchasesContext";
import MobileDataCard from "@/components/MobileDataCard";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetAllPurchases } from "@/features/purchases/hooks/useGetAllSales";
import type { Purchase } from "@/features/purchases/types/purchase.types";
import { useLanguage } from "@/context/LanguageContext";
import formatDate from "@/lib/formatDate";

export default function PurchasesList() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // const { purchases, addPurchase, updatePurchase, deletePurchase } = usePurchases();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const { data: purchases } = useGetAllPurchases({ page: currentPage, limit: entriesPerPage, searchTerm: globalFilterValue });
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder") || "البحث..."} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    // <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
    //   <DeleteConfirmationModal
    //     isOpen={purchaseToDelete !== null}
    //     onClose={() => setPurchaseToDelete(null)}
    //     onConfirm={() => {
    //       if (purchaseToDelete) handleDelete(purchaseToDelete);
    //     }}
    //     itemName={purchases.find((p) => p.id === purchaseToDelete)?.reference}
    //   />
    //   {/* Breadcrumbs & Subscription Banner */}
    //   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    //     <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
    //       <span>البداية</span>
    //       <ChevronLeft size={14} />
    //       <span className="text-[var(--primary)] font-medium">المشتريات</span>
    //     </div>
    //   </div>

    //   {/* Title Section */}
    //   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
    //     <div>
    //       <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
    //         <LayoutGrid className="text-[var(--primary)]" />
    //         المشتريات (جميع الفروع)
    //       </h1>
    //       <p className="text-[var(--text-muted)] mt-1 text-sm">الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.</p>
    //     </div>
    //     <button onClick={() => navigate("/purchases/create")} className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:opacity-90 transition-all">
    //       <Plus size={20} />
    //       <span>إضافة عملية شراء</span>
    //     </button>
    //   </div>

    //   {/* Table Controls */}
    //   <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
    //     <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
    //       <div className="flex items-center gap-2">
    //         <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
    //           <span>اظهار</span>
    //           <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] text-[var(--text-main)]">
    //             <option value={10}>10</option>
    //             <option value={25}>25</option>
    //             <option value={50}>50</option>
    //           </select>
    //         </div>
    //       </div>

    //       <div className="flex items-center gap-3">
    //         <div className="relative flex-1 md:w-64">
    //           <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
    //           <input type="text" placeholder="بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-main)]" />
    //         </div>
    //         <button className="p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-main)] transition-colors">
    //           <Filter size={18} />
    //         </button>
    //       </div>
    //     </div>

    //     {/* The Table - Desktop */}
    //     <div className="hidden md:block overflow-x-auto">
    //       <table className="w-full text-right border-collapse">
    //         <thead>
    //           <tr className="bg-[var(--table-header)] text-white">
    //             <th className="p-4 w-12">
    //               <button onClick={toggleSelectAll} className="text-white hover:opacity-80 transition-opacity">
    //                 {selectedRows.length === filteredPurchases.length ? <CheckSquare size={20} /> : <Square size={20} />}
    //               </button>
    //             </th>
    //             <th className="p-4 text-sm font-bold">
    //               <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
    //                 التاريخ <ArrowUpDown size={14} />
    //               </div>
    //             </th>
    //             <th className="p-4 text-sm font-bold">الرقم المرجعي</th>
    //             <th className="p-4 text-sm font-bold">المورد</th>
    //             <th className="p-4 text-sm font-bold">حالة عملية الشراء</th>
    //             <th className="p-4 text-sm font-bold">المجموع الكلي</th>
    //             <th className="p-4 text-sm font-bold">مدفوع</th>
    //             <th className="p-4 text-sm font-bold">الرصيد</th>
    //             <th className="p-4 text-sm font-bold">حالة الدفع</th>
    //             <th className="p-4 text-sm font-bold text-center">الإجراءات</th>
    //           </tr>
    //         </thead>
    //         <tbody className="divide-y divide-[var(--border)]">
    //           {filteredPurchases.length > 0 ? (
    //             filteredPurchases.map((purchase) => (
    //               <tr key={`desktop-${purchase.id}`} className={cn("hover:bg-[var(--bg-main)]/50 transition-colors group", selectedRows.includes(purchase.id) && "bg-[var(--primary)]/10")}>
    //                 <td className="p-4">
    //                   <button onClick={() => toggleSelectRow(purchase.id)} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
    //                     {selectedRows.includes(purchase.id) ? <CheckSquare size={20} className="text-[var(--primary)]" /> : <Square size={20} />}
    //                   </button>
    //                 </td>
    //                 <td className="p-4 text-sm text-[var(--text-main)] font-medium">{purchase.date}</td>
    //                 <td className="p-4 text-sm text-[var(--primary)] font-bold hover:underline cursor-pointer">{purchase.reference}</td>
    //                 <td className="p-4 text-sm text-[var(--text-main)]">{purchase.supplier}</td>
    //                 <td className="p-4">
    //                   <StatusBadge status={purchase.status} />
    //                 </td>
    //                 <td className="p-4 text-sm font-bold text-[var(--text-main)]">{purchase.total.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س</td>
    //                 <td className="p-4 text-sm font-bold text-[var(--primary)]">{purchase.paid.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س</td>
    //                 <td className="p-4 text-sm font-bold text-[var(--primary)]">{purchase.balance.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س</td>
    //                 <td className="p-4">
    //                   <PaymentBadge status={purchase.paymentStatus} />
    //                 </td>
    //                 <td className="p-4 text-center">
    //                   <div className="relative">
    //                     <button onClick={() => setOpenActionMenu(openActionMenu === purchase.id ? null : purchase.id)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors">
    //                       الإجراءات
    //                     </button>
    //                     {openActionMenu === purchase.id && (
    //                       <div className="absolute left-0 mt-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] z-10">
    //                         <button onClick={() => navigate(`/purchases/edit/${purchase.id}`)} className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2">
    //                           تعديل
    //                         </button>
    //                         <button onClick={() => handleDuplicate(purchase.id)} className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2">
    //                           تكرار عملية الشراء
    //                         </button>
    //                         <button
    //                           onClick={() => {
    //                             setPurchaseToDelete(purchase.id);
    //                             setOpenActionMenu(null);
    //                           }}
    //                           className="w-full text-right px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10 flex items-center gap-2"
    //                         >
    //                           حذف
    //                         </button>
    //                       </div>
    //                     )}
    //                   </div>
    //                 </td>
    //               </tr>
    //             ))
    //           ) : (
    //             <tr>
    //               <td colSpan={10} className="p-12 text-center text-[var(--text-muted)]">
    //                 <div className="flex flex-col items-center gap-3">
    //                   <div className="p-4 bg-[var(--bg-main)] rounded-full">
    //                     <FileText size={48} className="text-[var(--text-muted)] opacity-30" />
    //                   </div>
    //                   <p className="text-lg font-medium">لا توجد بيانات في الجدول</p>
    //                 </div>
    //               </td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>

    //     {/* Mobile View */}
    //     <div className="md:hidden space-y-4 p-4">
    //       {filteredPurchases.length > 0 ? (
    //         filteredPurchases.map((purchase) => (
    //           <MobileDataCard
    //             key={`mobile-${purchase.id}`}
    //             title={purchase.reference}
    //             status={{
    //               label: purchase.status === PurchaseStatus.RECEIVED ? "تم الاستلام" : purchase.status === PurchaseStatus.PENDING ? "قيد الانتظار" : "تم الطلب",
    //               type: purchase.status === PurchaseStatus.RECEIVED ? "success" : purchase.status === PurchaseStatus.PENDING ? "warning" : "info",
    //             }}
    //             fields={[
    //               { label: "التاريخ", value: purchase.date },
    //               { label: "المورد", value: purchase.supplier },
    //               { label: "المجموع الكلي", value: `${purchase.total.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`, isBold: true },
    //               { label: "مدفوع", value: `${purchase.paid.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`, isBold: true },
    //               { label: "الرصيد", value: `${purchase.balance.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`, isBold: true },
    //               {
    //                 label: "حالة الدفع",
    //                 value: purchase.paymentStatus === PaymentStatus.PAID ? "مدفوع" : purchase.paymentStatus === PaymentStatus.PARTIAL ? "جزئي" : "مستحق",
    //                 isBadge: true,
    //                 badgeType: purchase.paymentStatus === PaymentStatus.PAID ? "success" : purchase.paymentStatus === PaymentStatus.PARTIAL ? "warning" : "danger",
    //               },
    //             ]}
    //             actions={
    //               <div className="flex flex-wrap justify-end gap-2">
    //                 <button onClick={() => navigate(`/purchases/edit/${purchase.id}`)} className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold">
    //                   <Edit2 size={16} />
    //                   تعديل
    //                 </button>
    //                 <button onClick={() => handleDuplicate(purchase.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold">
    //                   <Copy size={16} />
    //                   تكرار
    //                 </button>
    //                 <button onClick={() => setPurchaseToDelete(purchase.id)} className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20 transition-colors flex items-center gap-1 text-xs font-bold">
    //                   <Trash2 size={16} />
    //                   حذف
    //                 </button>
    //               </div>
    //             }
    //           />
    //         ))
    //       ) : (
    //         <div className="p-12 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
    //           <p className="text-lg font-medium">لا توجد بيانات في الجدول</p>
    //         </div>
    //       )}
    //     </div>

    //     {/* Pagination */}
    //     <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
    //       <p className="text-sm text-[var(--text-muted)]">
    //         عرض {filteredPurchases.length > 0 ? 1 : 0} إلى {filteredPurchases.length} من {filteredPurchases.length} سجلات
    //       </p>
    //       <div className="flex items-center gap-1">
    //         <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
    //           <ChevronRight size={18} />
    //         </button>
    //         <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-bold shadow-sm">1</button>
    //         <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
    //           <ChevronLeft size={18} />
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Card>
      <CardHeader>
        <CardTitle>إدارة المشتريات </CardTitle>
        <CardDescription>تسجيل ومتابعة عمليات الشراء وإدارة الموردين لضمان دقة المخزون والتكاليف</CardDescription>{" "}
        <CardAction>
          <Button variant={"default"} asChild>
            <Link to={"/purchases/create"}>إضافة فاتورة مشتريات</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={purchases?.items}
          totalRecords={purchases?.totalCount}
          loading={!purchases?.items}
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
          breakpoint="9999px"
          className="custom-green-table custom-compact-table"
          dataKey="id"
        >
          <Column header={"التاريخ"} sortable body={(purchase: Purchase) => formatDate(purchase.orderDate)} />
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
