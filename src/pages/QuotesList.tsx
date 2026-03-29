import React, { useMemo, useState } from "react";
import { FileText, Search, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import EmailQuoteModal from "@/components/modals/EmailQuoteModal";
import MobileDataCard from "@/components/MobileDataCard";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

import AddQuoteModal from "@/components/modals/AddQuoteModal";

import { useQuotes, type QuoteRecord } from "../context/QuotesContext";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useGetAllQuotations } from "@/features/quotation/hooks/useGetAllQuotations";
<<<<<<< HEAD
=======
import formatDate from "@/lib/formatDate";
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683

export default function QuotesList() {
  const { t, direction } = useLanguage();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: quotations } = useGetAllQuotations();
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };
  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-container")) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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
    // <div className="p-4 space-y-4" dir={direction}>
    //   {/* Header Section */}
    //   {/* Page Header الموحد */}
    //   <div className="takamol-page-header">
    //     <div className={direction === "rtl" ? "text-right" : "text-left"}>
    //       <h1 className="takamol-page-title">عروض الأسعار (جميع الفروع)</h1>
    //       <p className="takamol-page-subtitle">البيانات الظاهرة في آخر 30 يوم. برجاء استخدام النموذج لإظهار مزيد من النتائج</p>
    //     </div>
    //     <button onClick={() => setShowAddModal(true)} className="btn-primary">
    //       <PlusCircle size={20} />
    //       إضافة عرض سعر
    //     </button>
    //   </div>

    //   {/* Table Container */}
    //   <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
    //     <div className="p-4 space-y-4">
    //       {/* Table Controls */}
    //       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    //         {/* Search */}
    //         <div className="relative w-full md:w-64 order-2 md:order-1">
    //           <input type="text" placeholder={t("search_placeholder") || "اكتب ما تريد ان تبحث عنه"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={cn("w-full border border-gray-200 dark:border-neutral-800 rounded-lg px-3 py-2 bg-white dark:bg-neutral-950 outline-none focus:border-primary text-sm", direction === "rtl" ? "pr-10" : "pl-10")} />
    //           <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", direction === "rtl" ? "right-3" : "left-3")} size={18} />
    //         </div>

    //         {/* Show Records */}
    //         <div className="flex items-center gap-2 order-1 md:order-2">
    //           <span className="text-sm text-gray-500">{t("show")}</span>
    //           <select value={showCount} onChange={(e) => setShowCount(Number(e.target.value))} className="border border-gray-200 dark:border-neutral-800 rounded-lg px-2 py-1.5 bg-white dark:bg-neutral-950 outline-none focus:border-primary text-sm font-bold">
    //             <option value={10}>10</option>
    //             <option value={25}>25</option>
    //             <option value={50}>50</option>
    //             <option value={100}>100</option>
    //           </select>
    //           <span className="text-sm text-gray-500">{t("records")}</span>
    //         </div>
    //       </div>

    //       {/* Table - Desktop */}
    //       <div className="hidden md:block overflow-x-auto">
    //         <table className={cn("w-full border-collapse", direction === "rtl" ? "text-right" : "text-left")}>
    //           <thead>
    //             <tr className="bg-[var(--table-header)] text-white">
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("date")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("quote_no")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("ref_no")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("cashier")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("customer")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("total")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10">{t("status")}</th>
    //               <th className="p-3 font-bold text-sm border-r border-white/10 text-center">{t("actions")}</th>
    //               <th className="p-3 w-10 text-center">
    //                 <div className="flex items-center justify-center">
    //                   <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
    //                 </div>
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="text-sm">
    //             {paginatedQuotes?.length === 0 ? (
    //               <tr>
    //                 <td colSpan={9} className="p-8 text-center text-gray-400 italic">
    //                   {t("no_data_in_table")}
    //                 </td>
    //               </tr>
    //             ) : (
    //               paginatedQuotes?.map((quote) => (
    //                 <tr key={`desktop-${quote.id}`} className="hover:bg-primary/5 transition-colors border-b border-gray-100 dark:border-neutral-800">
    //                   <td className="p-3 text-gray-500 border-r border-gray-100 dark:border-neutral-800">{quote.date}</td>
    //                   <td className="p-3 font-bold border-r border-gray-100 dark:border-neutral-800">{quote.quoteNo}</td>
    //                   <td className="p-3 text-gray-500 border-r border-gray-100 dark:border-neutral-800">{quote.refNo}</td>
    //                   <td className="p-3 border-r border-gray-100 dark:border-neutral-800">{quote.cashier}</td>
    //                   <td className="p-3 border-r border-gray-100 dark:border-neutral-800">{quote.customer}</td>
    //                   <td className="p-3 font-bold border-r border-gray-100 dark:border-neutral-800">{(quote.total || 0).toFixed(2)}</td>
    //                   <td className="p-3 border-r border-gray-100 dark:border-neutral-800">
    //                     <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", quote.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600")}>{t(quote.status)}</span>
    //                   </td>
    //                   <td className={cn("p-3 border-r border-gray-100 dark:border-neutral-800 text-center relative action-menu-container", activeActionMenu === quote.id && "z-[60]")}>
    //                     <div className="flex items-center justify-center gap-2">
    //                       <button onClick={() => navigate(`/quotes/create`)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
    //                         <Edit2 size={16} />
    //                       </button>
    //                       <button onClick={() => setShowDeleteModal(quote.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
    //                         <Trash2 size={16} />
    //                       </button>
    //                     </div>
    //                   </td>
    //                   <td className="p-3 text-center">
    //                     <input type="checkbox" className="accent-primary" />
    //                   </td>
    //                 </tr>
    //               ))
    //             )}
    //           </tbody>
    //         </table>
    //       </div>

    //       {/* Mobile View */}
    //       <div className="md:hidden space-y-4">
    //         {paginatedQuotes?.length === 0 ? (
    //           <div className="p-8 text-center text-gray-400 italic bg-gray-50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-gray-200 dark:border-neutral-800">{t("no_data_in_table")}</div>
    //         ) : (
    //           paginatedQuotes?.map((quote) => (
    //             <MobileDataCard
    //               key={`mobile-${quote.id}`}
    //               title={quote.quoteNo}
    //               subtitle={quote.refNo}
    //               status={quote.status}
    //               fields={[
    //                 { label: t("date"), value: quote.date },
    //                 { label: t("customer"), value: quote.customer },
    //                 { label: t("total"), value: (quote.total || 0).toFixed(2), isBold: true },
    //               ]}
    //               actions={
    //                 <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
    //                   <button onClick={() => navigate(`/quotes/view/${quote.id}`)} className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold">
    //                     <FileText size={16} />
    //                     {t("view")}
    //                   </button>
    //                   <button onClick={() => navigate("/quotes/create")} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold">
    //                     <Edit2 size={16} />
    //                     {t("edit")}
    //                   </button>
    //                   <button
    //                     onClick={() => {
    //                       setShowDeleteModal(quote.id);
    //                     }}
    //                     className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold"
    //                   >
    //                     <Trash2 size={16} />
    //                     {t("delete")}
    //                   </button>
    //                 </div>
    //               }
    //             />
    //           ))
    //         )}
    //       </div>

    //       {/* Pagination Section */}
    //       <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
    //         <div className="flex items-center gap-1 text-sm text-gray-500">
    //           <span>{t("showing")}</span>
    //           <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * showCount + 1}</span>
    //           <span>{t("to")}</span>
    //           <span className="font-bold text-gray-900 dark:text-white">{Math.min(currentPage * showCount, filteredQuotes.length)}</span>
    //           <span>{t("of")}</span>
    //           <span className="font-bold text-gray-900 dark:text-white">{filteredQuotes.length}</span>
    //           <span>{t("records")}</span>
    //         </div>

    //         <div className="flex items-center gap-1">
    //           <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 text-sm font-medium transition-colors">
    //             {t("previous")}
    //           </button>
    //           <div className="flex items-center gap-1">
    //             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">{currentPage}</button>
    //           </div>
    //           <button onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(filteredQuotes.length / showCount), prev + 1))} disabled={currentPage >= Math.ceil(filteredQuotes.length / showCount)} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 text-sm font-medium transition-colors">
    //             {t("next")}
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   {/* Hidden PDF Templates */}
    //   <div className="hidden">
    //     {quotes?.map((quote) => (
    //       <div key={quote.id} id={`quote-template-${quote.id}`} className="bg-white p-8 w-[210mm] text-sm" dir="rtl" style={{ display: "none", fontFamily: "sans-serif" }}>
    //         <div className="flex justify-between items-start mb-4">
    //           <div className="text-right">
    //             <h2 className="text-lg font-bold">شركة اختبار</h2>
    //             <p>الرياض - الملقا - سعود بن فيصل</p>
    //             <p>السجل التجاري: 1234123123</p>
    //             <p>هاتف: 0146580073</p>
    //             <p>رخصة البلدية: 50608090</p>
    //           </div>
    //           <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    //             </svg>
    //           </div>
    //         </div>

    //         <div className="text-center bg-gray-100 py-2 mb-4">
    //           <h3 className="font-bold">عرض أسعار</h3>
    //         </div>

    //         <table className="w-full mb-4 text-xs">
    //           <tbody>
    //             <tr className="bg-gray-100">
    //               <td className="p-1 font-bold text-right border">رقم عرض السعر</td>
    //               <td className="p-1 text-right border">{quote.quoteNo}</td>
    //               <td className="p-1 font-bold text-right border">الرقم المرجعي</td>
    //               <td className="p-1 text-right border">{quote.refNo}</td>
    //               <td className="p-1 font-bold text-right border">تاريخ اصدار الفاتورة</td>
    //               <td className="p-1 text-right border">{quote.date}</td>
    //             </tr>
    //             <tr>
    //               <td className="p-1 font-bold text-right border">ملاحظات</td>
    //               <td colSpan={5} className="p-1 text-right border">
    //                 يتم الاستلام فورا بعد الدفع
    //               </td>
    //             </tr>
    //           </tbody>
    //         </table>

    //         <div className="text-center bg-gray-100 py-1 mb-4">
    //           <h4 className="font-bold text-xs">بيانات العميل</h4>
    //         </div>

    //         <table className="w-full mb-4 text-xs">
    //           <tbody>
    //             <tr className="bg-gray-100">
    //               <td className="p-1 font-bold text-right border">رقم العميل</td>
    //               <td className="p-1 font-bold text-right border">اسم العميل</td>
    //               <td className="p-1 font-bold text-right border">الرقم الضريبي للعميل</td>
    //               <td className="p-1 font-bold text-right border">رقم الجوال</td>
    //               <td className="p-1 font-bold text-right border">المدينة</td>
    //               <td className="p-1 font-bold text-right border">الحي</td>
    //               <td className="p-1 font-bold text-right border">اسم الشارع</td>
    //               <td className="p-1 font-bold text-right border">الرمز البريدي</td>
    //               <td className="p-1 font-bold text-right border">رقم المبنى</td>
    //               <td className="p-1 font-bold text-right border">الرقم الاضافي</td>
    //             </tr>
    //             <tr>
    //               <td className="p-1 text-right border">1</td>
    //               <td className="p-1 text-right border">عميل افتراضي</td>
    //               <td className="p-1 text-right border"></td>
    //               <td className="p-1 text-right border">00</td>
    //               <td className="p-1 text-right border">Riyadh</td>
    //               <td className="p-1 text-right border"></td>
    //               <td className="p-1 text-right border">KSA</td>
    //               <td className="p-1 text-right border"></td>
    //               <td className="p-1 text-right border"></td>
    //               <td className="p-1 text-right border">13248</td>
    //             </tr>
    //           </tbody>
    //         </table>

    //         <table className="w-full mb-4 text-xs">
    //           <thead>
    //             <tr className="bg-gray-100">
    //               <th className="p-1 font-bold border">م</th>
    //               <th className="p-1 font-bold border">وصف</th>
    //               <th className="p-1 font-bold border">كمية</th>
    //               <th className="p-1 font-bold border">سعر الوحدة</th>
    //               <th className="p-1 font-bold border">السعر الكلي</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             <tr>
    //               <td className="p-1 text-center border">1</td>
    //               <td className="p-1 text-right border">83821969 - جلبة 3/4</td>
    //               <td className="p-1 text-center border">500.00 وحدة</td>
    //               <td className="p-1 text-center border">3.50</td>
    //               <td className="p-1 text-center border">1750.00</td>
    //             </tr>
    //             <tr>
    //               <td className="p-1 text-center border">2</td>
    //               <td className="p-1 text-right border">68823714 - صنف تجريبي</td>
    //               <td className="p-1 text-center border">5.00 وحدة</td>
    //               <td className="p-1 text-center border">150.00</td>
    //               <td className="p-1 text-center border">750.00</td>
    //             </tr>
    //           </tbody>
    //         </table>

    //         <p className="text-center mb-4 text-xs">فقط وقدره: ألفان و خمسمائة ريال سعودي</p>

    //         <div className="flex justify-start">
    //           <table className="text-xs w-64">
    //             <tbody>
    //               <tr>
    //                 <td className="p-1 border text-right font-bold">الإجمالي</td>
    //                 <td className="p-1 border text-right">2500.00 ر.س</td>
    //               </tr>
    //               <tr>
    //                 <td className="p-1 border text-right font-bold">الإجمالي الكلي</td>
    //                 <td className="p-1 border text-right">2500.00 ر.س</td>
    //               </tr>
    //             </tbody>
    //           </table>
    //         </div>

    //         <div className="mt-4 text-xs text-right">
    //           <p>معد العرض: mm .</p>
    //           <p>شكراً لزيارتكم ننتظركم مرة أخرى للإرجاع والاستبدال خلال 48 ساعة يجب احضار الفاتورة</p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //   <EmailQuoteModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />

    //   <DeleteConfirmationModal
    //     isOpen={showDeleteModal !== null}
    //     onClose={() => setShowDeleteModal(null)}
    //     onConfirm={() => {
    //       if (showDeleteModal) {
    //         handleDeleteQuote(showDeleteModal);
    //       }
    //     }}
    //     itemName={quotes.find((q) => q.id === showDeleteModal)?.quoteNo}
    //   />
    //   <AddQuoteModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    // </div>
    <Card>
      <CardHeader className="">
        <CardTitle>عروض الأسعار</CardTitle>
        <CardDescription>يمكنك إدارة ، إضافة ، تعديل عروض الأسعار الخاصة بك</CardDescription>
        <CardAction>
          <Button variant={"default"} asChild>
<<<<<<< HEAD
            <Link to={"/sales/create"}>إضافة عرض سعر</Link>
=======
            <Link to={"/quotes/create"}>إضافة عرض سعر</Link>
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          value={quotations || []}
          rowsPerPageOptions={[5, 10, 20, 50]}
          lazy
          paginator
          rows={entriesPerPage}
          first={(currentPage - 1) * entriesPerPage}
          totalRecords={quotations?.length || 0}
          onPage={(e: DataTablePageEvent) => {
            if (e.page === undefined) return;
            setCurrentPage(e.page + 1);
            setEntriesPerPage(e.rows);
          }}
          loading={!quotations}
          header={header}
          responsiveLayout="stack"
          className="custom-green-table custom-compact-table"
          dataKey="id"
          stripedRows={false}
        >
          <Column header={"رقم الفاتورة"} sortable field="quotationNumber" />
<<<<<<< HEAD
          <Column header="التاريخ" sortable field="quotationDate" body={(row) => new Date(row.quotationDate).toLocaleDateString("ar-EG")} />
=======
          <Column header="التاريخ" sortable field="quotationDate" body={(row) => formatDate(row.quotationDate)} />
>>>>>>> b0e5c146f6498030c86350b385228534c7b32683
          <Column header={"اسم العميل"} sortable field="customerName" />
          <Column header={"الكاشير"} sortable field="createdBy" />
          <Column header={"حالة عرض السعر"} sortable field="status" />
          <Column header={"المجموع الفرعي"} sortable field="subTotal" />
          <Column header={"قيمة الضرائب"} sortable field="taxAmount" />
          <Column header={"قيمة الخصم"} sortable field="discountAmount" />
          <Column header={"المجموع الكلي"} sortable field="grandTotal" />
          <Column
            header={t("actions")}
            body={(row) => (
              <div className="flex gap-2">
                <button onClick={() => {}} className="btn-minimal-action btn-compact-action">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => {}} className="btn-minimal-action btn-compact-action text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        </DataTable>
      </CardContent>
      {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
    </Card>
  );
}
