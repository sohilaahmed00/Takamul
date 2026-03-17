import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Search, Edit2, Trash2, ArrowRight, ArrowLeft, Download, Printer, Menu, LayoutGrid, ShoppingCart, ArrowUp, ArrowDown, PlusCircle, DollarSign, FileSpreadsheet, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSales } from "@/context/SalesContext";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { ResponsiveModal } from "@/components/modals/ResponsiveModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { useGetAllSales } from "../features/sales/hooks/useGetAllSales";

interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  saleStatus: "completed" | "returned";
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: "paid" | "partial" | "unpaid";
  paymentType: "mada" | "cash" | "bank_transfer";
}

interface Payment {
  id: string;
  date: string;
  refNo: string;
  amount: number;
  type: string;
}

const mockSales: SaleRecord[] = [
  { id: "1", invoiceNo: "506", date: "23/02/2026 02:59:57", refNo: "SALE/POS2026/02/0611", cashier: "شركة اختيار", customer: "شخص عام", saleStatus: "returned", grandTotal: -500.0, paid: -500.0, remaining: 0.0, paymentStatus: "paid", paymentType: "mada" },
  { id: "2", invoiceNo: "505", date: "23/02/2026 02:58:48", refNo: "SALE/POS2026/02/0611", cashier: "شركة اختيار", customer: "شخص عام", saleStatus: "completed", grandTotal: 500.0, paid: 500.0, remaining: 0.0, paymentStatus: "paid", paymentType: "mada" },
  { id: "3", invoiceNo: "504", date: "16/02/2026 20:39:44", refNo: "SALE/POS2026/02/0610", cashier: "شركة اختيار", customer: "شخص عام", saleStatus: "completed", grandTotal: 150.0, paid: 150.0, remaining: 0.0, paymentStatus: "paid", paymentType: "mada" },
  { id: "4", invoiceNo: "503", date: "16/02/2026 20:39:34", refNo: "SALE/POS2026/02/0609", cashier: "شركة اختيار", customer: "شخص عام", saleStatus: "completed", grandTotal: 400.0, paid: 400.0, remaining: 0.0, paymentStatus: "paid", paymentType: "mada" },
  { id: "5", invoiceNo: "502", date: "16/02/2026 20:25:58", refNo: "SALE/POS2026/02/0608", cashier: "شركة اختيار", customer: "شخص عام", saleStatus: "completed", grandTotal: 500.0, paid: 500.0, remaining: 0.0, paymentStatus: "paid", paymentType: "mada" },
];

export default function AllSales() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { data } = useGetAllSales();

  const salesContext = useSales() || {};
  const safeSales = Array.isArray(salesContext.sales) && salesContext.sales.length > 0 ? salesContext.sales : mockSales;
  const addSale = salesContext.addSale || (() => {});
  const deleteSale = salesContext.deleteSale || (() => {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-container")) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const [showInvoiceDetails, setShowInvoiceDetails] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showPayments, setShowPayments] = useState<any | null>(null);
  const [showEditPayment, setShowEditPayment] = useState<Payment | null>(null);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState<Payment | null>(null);
  const [salePayments, setSalePayments] = useState<Payment[]>([]);
  const [showStoreBond, setShowStoreBond] = useState<any | null>(null);
  const [showClaimBond, setShowClaimBond] = useState<any | null>(null);
  const [showAddDelivery, setShowAddDelivery] = useState<any | null>(null);
  const [bondToDelete, setBondToDelete] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [filters, setFilters] = useState({
    refNo: "",
    invoiceNo: "",
    customer: "",
    branch: "",
    fromDate: "",
    toDate: "",
    grandTotal: "",
    deliveryCompany: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters, showCount]);

  useEffect(() => {
    if (showPayments) {
      setSalePayments([{ id: "1", date: "11/02/2026 19:31:51", refNo: "IPAY2026/02/0609", amount: 250.0, type: "mada" }]);
    }
  }, [showPayments]);

  const handleFilter = () => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    const initialFilters = { refNo: "", invoiceNo: "", customer: "", branch: "", fromDate: "", toDate: "", grandTotal: "", deliveryCompany: "all" };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const filteredSales = (data ?? []).filter((sale) => {
    if (!sale) return false;

    return (appliedFilters.refNo ? sale.orderNumber?.toLowerCase().includes(appliedFilters.refNo.toLowerCase()) : true) && (appliedFilters.customer ? sale.customerName?.toLowerCase().includes(appliedFilters.customer.toLowerCase()) : true) && (appliedFilters.branch ? sale.warehouseName?.toLowerCase().includes(appliedFilters.branch.toLowerCase()) : true) && (searchTerm ? sale.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) : true);
  });

  // const duplicateSale = (sale: any) => {
  //   const { id, ...saleData } = sale;
  //   const newSale = {
  //     ...saleData,
  //     invoiceNo: (parseInt(safeSales[0]?.invoiceNo || "0") + 1).toString(),
  //     date: new Date().toLocaleString("en-GB"),
  //   };
  //   addSale(newSale);
  //   setActiveActionMenu(null);
  // };

  const paginatedSales = filteredSales.slice((currentPage - 1) * showCount, currentPage * showCount);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedItems(filteredSales.map((s) => s.id));
    else setSelectedItems([]);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="text-gray-800">{t("sales")}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white border border-gray-300 rounded-lg text-[#00a651] shadow-sm">
            <ShoppingCart size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">{t("sales_all_branches")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white text-[#00a651] hover:bg-green-50 rounded-lg border border-gray-200 transition-colors shadow-sm" onClick={() => setShowFilters(!showFilters)} title={t("filter_results")}>
            {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </button>

          {/* القائمة العلوية الذكية (تفتح يمين في العربي ويسار في الإنجليزي) */}
          <div className="relative action-menu-container">
            <button className="p-2 bg-white text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors shadow-sm" onClick={() => setActiveActionMenu(activeActionMenu === "header-actions" ? null : "header-actions")}>
              <Menu size={18} />
            </button>
            {activeActionMenu === "header-actions" && (
              <div className={cn("absolute z-50 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[220px] overflow-hidden", direction === "rtl" ? "left-0" : "right-0")}>
                <div className="flex flex-col" dir={direction}>
                  <button
                    onClick={() => {
                      navigate("/sales/create-from-quote");
                      setActiveActionMenu(null);
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 transition-colors"
                  >
                    <PlusCircle size={18} className="text-[#00a651] shrink-0" />
                    <span className="font-bold text-gray-800 flex-1 text-start">{t("add_sale_operation")}</span>
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 transition-colors">
                    <FileSpreadsheet size={18} className="text-[#00a651] shrink-0" />
                    <span className="text-gray-700 font-medium flex-1 text-start">تصدير إلى ملف Excel</span>
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <FileText size={18} className="text-[#00a651] shrink-0" />
                    <span className="text-gray-700 font-medium flex-1 text-start">تصدير إلى ملف pdf</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-w-0">
        <p className="text-sm font-bold text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">البيانات الظاهرة هي لآخر 30 يوم. برجاء استخدام النموذج لإظهار مزيد من النتائج</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full md:w-72">
            <input type="text" placeholder={t("search_placeholder")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="takamol-input !py-2" />
            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", direction === "rtl" ? "left-3" : "right-3")} size={18} />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 w-full md:w-auto justify-end">
            <span>{t("show")}</span>
            <select value={showCount} onChange={(e) => setShowCount(Number(e.target.value))} className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-[#00a651] focus:border-[#00a651] px-3 py-1.5 outline-none cursor-pointer">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>سجلات</span>
          </div>
        </div>

        {showFilters && (
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("ref_no")}</label>
                <input type="text" value={filters.refNo} onChange={(e) => setFilters({ ...filters, refNo: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("invoice_no")}</label>
                <input type="text" value={filters.invoiceNo} onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("customer")}</label>
                <select value={filters.customer} onChange={(e) => setFilters({ ...filters, customer: e.target.value })} className="takamol-input">
                  <option value="">اختر عميل</option>
                  <option value="شخص عام">شخص عام</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("branch")}</label>
                <input type="text" value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("from_date")}</label>
                <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("to_date")}</label>
                <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("grand_total")}</label>
                <input type="text" value={filters.grandTotal} onChange={(e) => setFilters({ ...filters, grandTotal: e.target.value })} className="takamol-input" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t("delivery_companies")}</label>
                <select value={filters.deliveryCompany} onChange={(e) => setFilters({ ...filters, deliveryCompany: e.target.value })} className="takamol-input">
                  <option value="all">{t("all")}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3 pt-4 border-t border-gray-200">
              <button className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors" onClick={handleReset}>
                {t("reset_form")}
              </button>
              <button className="px-8 py-2.5 bg-[#00a651] hover:bg-[#008f45] text-white rounded-lg font-bold transition-colors" onClick={handleFilter}>
                تطبيق الفلتر
              </button>
            </div>
          </div>
        )}

        <div className="hidden md:block overflow-visible pb-32">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="takamol-table mb-0 w-full text-center text-sm">
              <thead className="bg-[#00a651] text-white">
                <tr>
                  <th className="w-10 text-center p-3 align-middle">
                    <input type="checkbox" className="accent-white w-4 h-4 rounded" checked={selectedItems.length === filteredSales.length && filteredSales.length > 0} onChange={handleSelectAll} />
                  </th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("invoice_no")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("date")}</th>
                  {/* <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("ref_no")}</th> */}
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("cashier")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("customer")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">حالة الفاتورة</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("grand_total")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("paid")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">المبلغ المتبقي</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("payment_status")}</th>
                  <th className="p-3 border-l border-white/20 whitespace-nowrap text-center align-middle">{t("payment_type")}</th>
                  <th className="w-32 text-center p-3 align-middle">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedSales.map((sale, index) => (
                  <tr key={`desktop-${sale.id}`} className="hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer" onClick={() => setShowInvoiceDetails(sale)}>
                    <td className="p-3 text-center border-l border-gray-100 align-middle" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="accent-[#00a651] w-4 h-4 rounded" checked={selectedItems.includes(sale.id)} onChange={() => handleSelectItem(sale.id)} />
                    </td>
                    <td className="p-3 border-l border-gray-100 font-bold text-gray-800 align-middle">{sale.orderNumber}</td>
                    <td>{new Date(sale.orderDate).toLocaleDateString()}</td>
                    <td className="p-3 border-l border-gray-100 text-gray-600 align-middle">
                      <div className="flex flex-col items-center justify-center leading-tight">
                        <span>شركة</span>
                        <span>اختيار</span>
                      </div>
                    </td>
                    <td className="p-3 border-l border-gray-100 font-bold text-gray-800 align-middle">{sale?.customerName}</td>
                    <td className="p-3 border-l border-gray-100 align-middle">
                      <span className={cn("px-3 py-1 rounded-md text-xs font-bold inline-block", sale.orderStatus === "Confirmed" ? "bg-[#e6f4ea] text-[#00a651]" : "bg-orange-100 text-orange-700")}>{sale.orderStatus}</span>
                    </td>
                    <td className="p-3 border-l border-gray-100 font-bold align-middle" dir="ltr">
                      {(sale.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="p-3 border-l border-gray-100 text-gray-600 font-medium align-middle" dir="ltr">
                      {/* {(sale. || 0).toFixed(2)} */}
                    </td>
                    {/*   <td className="p-3 border-l border-gray-100 text-gray-600 font-medium align-middle" dir="ltr">
                      {(sale.remaining || 0).toFixed(2)}
                    </td>
                    <td className="p-3 border-l border-gray-100 align-middle">
                      <span className="bg-[#e6f4ea] text-[#00a651] px-3 py-1 rounded-md text-xs font-bold inline-block">{t(sale.paymentStatus)}</span>
                    </td>
                    <td className="p-3 border-l border-gray-100 font-bold text-gray-500 align-middle">
                      {sale.paymentType === "mada" && (
                        <div className="flex flex-col justify-center items-center gap-1">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mada_Logo.svg/1200px-Mada_Logo.svg.png" alt="mada" className="h-3" />
                          <span className="text-[10px]">مدى</span>
                        </div>
                      )}
                    </td> */}
                    {/* <td className="p-3 border-l border-gray-100 align-middle" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center items-center relative action-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 });
                            setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id);
                          }}
                          className="bg-[#00a651] hover:bg-[#008f45] text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm w-fit"
                        >
                          الإجراءات <ChevronDown size={14} />
                        </button>

                        {activeActionMenu === sale.id &&
                          menuPosition &&
                          createPortal(
                            <div style={{ position: "absolute", top: `${menuPosition.top}px`, left: `${menuPosition.left}px`, transform: "translateX(-50%)" }} className="w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] py-2 overflow-y-auto max-h-[60vh] takamol-scrollbar" dir={direction}>
                              <button
                                onClick={() => {
                                  setShowInvoiceDetails(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <FileText size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تفاصيل فاتورة المبيعات</span>
                              </button>
                              <button
                                onClick={() => {
                                  duplicateSale(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <Copy size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تكرار فاتورة المبيعات</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowPayments(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <DollarSign size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">عرض المدفوعات</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <PlusCircle size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">إضافة الدفع</span>
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/sales/return/${sale.id}`);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <RotateCcw size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">إرجاع البيع</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowStoreBond(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <FileCheck size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">سند مخزني</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowClaimBond(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <Info size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">سند مطالبة</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddDelivery(sale);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                              >
                                <Truck size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">إضافة تسليم</span>
                              </button>
                              <div className="h-px bg-gray-100 my-1 mx-4" />
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <Download size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تحميل بصيغة PDF</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <FileSpreadsheet size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تحميل كملف إكسل</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <FileJson size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تحميل بصيغة CSV</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <Mail size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">إرسال الفاتورة بالبريد الالكتروني</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <MessageCircle size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">إرسال الفاتورة عبر الواتس</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <FileMinus size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">سند فسخ</span>
                              </button>
                              <button onClick={() => setActiveActionMenu(null)} className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                                <UserCog size={16} className="text-gray-400 shrink-0" /> <span className="flex-1 text-start">تعديل المندوب / الموظف</span>
                              </button>
                              <div className="h-px bg-gray-100 my-1 mx-4" />
                              <button
                                onClick={() => {
                                  setBondToDelete(sale.id);
                                  setActiveActionMenu(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-bold"
                              >
                                <Trash2 size={16} className="shrink-0" /> <span className="flex-1 text-start">حذف الفاتورة</span>
                              </button>
                            </div>,
                            document.body,
                          )}
                      </div>
                    </td> */}
                  </tr>
                ))}
                {paginatedSales.length === 0 && (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-gray-500 font-bold">
                      لا توجد بيانات مطابقة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 pt-4 border-t border-gray-100">
          <div className="text-sm font-bold text-[var(--primary)]">
            عرض 1 إلى {showCount} من {filteredSales.length} سجلات
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50">
              <ArrowRight className="w-4 h-4" /> السابق
            </button>
            <button className="px-4 py-2 bg-[#00a651] text-white font-bold text-sm border-l border-gray-200">{currentPage}</button>
            <button disabled={currentPage * showCount >= filteredSales.length} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50">
              التالي <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <ResponsiveModal key="invoice-details-modal" isOpen={!!showInvoiceDetails} onClose={() => setShowInvoiceDetails(null)} title={`${t("invoice_details")} ${showInvoiceDetails?.invoiceNo || ""}`} maxWidth="max-w-4xl">
          {showInvoiceDetails && (
            <div className="p-8 space-y-8" dir={direction}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2 text-right">
                  <h3 className="font-bold text-[#00a651]">{t("customer_default")}</h3>
                  <p className="text-sm text-gray-600">{t("phone")}: 00</p>
                  <p className="text-sm text-gray-600">{t("email")}: info@posit.sa</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <LayoutGrid size={48} className="text-gray-300" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <h3 className="font-bold text-[#00a651]">{t("test_company")}</h3>
                  <p className="text-sm text-gray-600">{t("cr_no")}: 1234123123</p>
                  <p className="text-sm text-gray-600">{t("vat_no")}: 50608090</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold text-[#00a651]">
                    {t("ref_no")}: {showInvoiceDetails.refNo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("date")}: {showInvoiceDetails.date}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold">
                    {t("sale_status")}: <span className="text-[#00a651]">{t(showInvoiceDetails.saleStatus)}</span>
                  </p>
                  <p className="text-sm font-bold">
                    {t("payment_status")}: <span className="text-[#00a651]">{t(showInvoiceDetails.paymentStatus)}</span>
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-right border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#00a651] text-white">
                      <th className="p-3 border-l border-white/20">{t("item_no")}</th>
                      <th className="p-3 border-l border-white/20">{t("description")}</th>
                      <th className="p-3 border-l border-white/20">{t("quantity")}</th>
                      <th className="p-3 border-l border-white/20">{t("unit_price")}</th>
                      <th className="p-3 border-l border-white/20">{t("total_without_vat")}</th>
                      <th className="p-3 border-l border-white/20">{t("vat")}</th>
                      <th className="p-3">{t("total_price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 bg-white">
                      <td className="p-3 border-x border-gray-100">1</td>
                      <td className="p-3 border-x border-gray-100">60990980 - عباية كريب مع اكمام مموجه</td>
                      <td className="p-3 border-x border-gray-100">-2.00 وحدة</td>
                      <td className="p-3 border-x border-gray-100">250.00</td>
                      <td className="p-3 border-x border-gray-100">500.00-</td>
                      <td className="p-3 border-x border-gray-100">0.00</td>
                      <td className="p-3 border-x border-gray-100 font-bold">500.00-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-gray-100">
                <button className="bg-[#00a651] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#008f45] transition-colors">
                  <Printer size={18} /> {t("print")}
                </button>
                <button className="bg-[#00a651] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#008f45] transition-colors">
                  <Download size={18} /> {t("download_pdf")}
                </button>
                <button className="bg-[#00a651] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#008f45] transition-colors">
                  <Mail size={18} /> {t("send_email")}
                </button>
                <button className="bg-[#00a651] text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-[#008f45] transition-colors">
                  <DollarSign size={18} /> {t("add_payment")}
                </button>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal key="payments-modal" isOpen={!!showPayments} onClose={() => setShowPayments(null)} title={t("payment_view_title").replace("{ref}", showPayments?.refNo || "")} maxWidth="max-w-4xl">
          {showPayments && (
            <div className="p-6" dir={direction}>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-right border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#00a651] text-white">
                      <th className="p-3 border-l border-white/20">{t("date")}</th>
                      <th className="p-3 border-l border-white/20">{t("ref_no")}</th>
                      <th className="p-3 border-l border-white/20">{t("paid")}</th>
                      <th className="p-3 border-l border-white/20">{t("payment_type")}</th>
                      <th className="p-3">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {salePayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100">
                        <td className="p-3 border-x border-gray-100">{payment.date}</td>
                        <td className="p-3 border-x border-gray-100">{payment.refNo}</td>
                        <td className="p-3 border-x border-gray-100 font-bold">{(payment.amount || 0).toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-100">{t(payment.type)}</td>
                        <td className="p-3 border-x border-gray-100 flex justify-center gap-2">
                          <button onClick={() => setSalePayments(salePayments.filter((p) => p.id !== payment.id))} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                          <button onClick={() => setShowEditPayment(payment)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setShowPaymentReceipt(payment)} className="text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg">
                            <FileText size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal key="edit-payment-modal" isOpen={!!showEditPayment} onClose={() => setShowEditPayment(null)} title={t("edit_payment")} maxWidth="max-w-2xl">
          {showEditPayment && (
            <div className="p-8 space-y-6 text-right" dir={direction}>
              <p className="text-sm text-[#00a651] font-bold">{t("edit_payment_desc")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("date")} *</label>
                  <input type="text" defaultValue={showEditPayment.date} className="takamol-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("payment_ref")} *</label>
                  <input type="text" defaultValue={showEditPayment.refNo} className="takamol-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("paid")}</label>
                  <input type="number" defaultValue={showEditPayment.amount} className="takamol-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("paid_by")}</label>
                  <select className="takamol-input">
                    <option value="mada">{t("mada")}</option>
                    <option value="cash">{t("cash")}</option>
                    <option value="bank_transfer">{t("bank_transfer")}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button onClick={() => setShowEditPayment(null)} className="bg-[#00a651] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#008f45]">
                  {t("edit_payment")}
                </button>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal
          key="payment-receipt-modal"
          isOpen={!!showPaymentReceipt}
          onClose={() => setShowPaymentReceipt(null)}
          maxWidth="max-w-4xl"
          headerActions={
            <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold">
              <Printer size={16} /> {t("print")}
            </button>
          }
        >
          {showPaymentReceipt && (
            <div className="p-10 space-y-8 text-right" dir={direction}>
              <div className="flex justify-between items-start">
                <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                  <LayoutGrid size={48} className="text-gray-300" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#00a651]">{t("test_company")}</h2>
                  <p className="text-sm font-bold text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                  <p className="text-sm font-bold text-gray-600">السجل التجاري: 1234123123</p>
                </div>
              </div>
              <div className="bg-[#e6f4ea] text-[#00a651] p-3 rounded-lg text-center font-bold text-lg">{t("receipt_bond")}</div>
              <div className="flex justify-between font-bold text-gray-800">
                <p>
                  {t("date")}: {showPaymentReceipt.date.split(" ")[0]}
                </p>
                <p>
                  {t("payment_ref")}: {showPaymentReceipt.refNo}
                </p>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal
          key="store-bond-modal"
          isOpen={!!showStoreBond}
          onClose={() => setShowStoreBond(null)}
          title={t("store_bond_title")}
          maxWidth="max-w-4xl"
          headerActions={
            <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold">
              <Printer size={16} /> {t("print")}
            </button>
          }
        >
          {showStoreBond && (
            <div className="p-8 space-y-6" dir={direction}>
              <div className="text-right space-y-2">
                <p className="text-sm font-bold">
                  <span className="text-gray-500">{t("cashier")}:</span> {showStoreBond.cashier}
                </p>
                <p className="text-sm font-bold">
                  <span className="text-gray-500">{t("ref_no")}:</span> <span className="text-[#00a651]">{showStoreBond.refNo}</span>
                </p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-right border-collapse min-w-[500px]">
                  <thead className="bg-[#00a651] text-white">
                    <tr>
                      <th className="p-3 border-l border-white/20">{t("name")}</th>
                      <th className="p-3 border-l border-white/20">{t("quantity")}</th>
                      <th className="p-3">{t("ref")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border-x border-gray-100 font-bold">60990980 - عباية كريب مع اكمام مموجه</td>
                      <td className="p-3 border-x border-gray-100 font-bold">-2.00</td>
                      <td className="p-3 border-x border-gray-100">003</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal
          key="claim-bond-modal"
          isOpen={!!showClaimBond}
          onClose={() => setShowClaimBond(null)}
          maxWidth="max-w-4xl"
          headerActions={
            <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-bold">
              <Printer size={16} /> {t("print")}
            </button>
          }
        >
          {showClaimBond && (
            <div className="p-10 space-y-8 text-right" dir={direction}>
              <div className="bg-gray-100 p-4 rounded-xl text-center font-bold text-xl text-gray-800 border border-gray-200">{t("claim_letter_title")}</div>
              <div className="space-y-4 font-medium text-gray-700 leading-loose bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p>
                  <span className="font-bold text-[#00a651]">المرسل:</span> {showClaimBond.cashier}
                </p>
                <p>
                  <span className="font-bold text-[#00a651]">المستلم:</span> {showClaimBond.customer}
                </p>
                <p className="pt-4 text-justify">
                  نود تذكيركم بأن الفاتورة رقم <span className="font-bold text-gray-900">{showClaimBond.invoiceNo}</span> الصادرة بتاريخ <span className="font-bold text-gray-900">{showClaimBond.date}</span> المتعلقة بقيمة <span className="font-bold text-gray-900">{(showClaimBond.grandTotal || 0).toFixed(2)}</span> ريال لم يتم سدادها حتى الآن.
                </p>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <ResponsiveModal key="add-delivery-modal" isOpen={!!showAddDelivery} onClose={() => setShowAddDelivery(null)} title={t("delivery_title")} maxWidth="max-w-4xl">
          {showAddDelivery && (
            <div className="p-8 space-y-6 text-right" dir={direction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("date")} *</label>
                  <input type="text" defaultValue="07:44:00 23/02/2026" className="takamol-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("delivery_status")} *</label>
                  <select className="takamol-input">
                    <option>جاري العمل عليه</option>
                    <option>تم التوصيل</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("sale_ref")} *</label>
                  <input type="text" defaultValue={showAddDelivery.refNo} className="takamol-input font-bold text-[#00a651]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t("customer")} *</label>
                  <input type="text" defaultValue={showAddDelivery.customer} className="takamol-input" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setShowAddDelivery(null);
                    navigate("/sales/deliveries");
                  }}
                  className="bg-[#00a651] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#008f45]"
                >
                  حفظ التوصيل
                </button>
              </div>
            </div>
          )}
        </ResponsiveModal>

        <DeleteConfirmationModal
          key="delete-bond-modal"
          isOpen={bondToDelete !== null}
          onClose={() => setBondToDelete(null)}
          onConfirm={() => {
            deleteSale(bondToDelete!);
            setBondToDelete(null);
            setActiveActionMenu(null);
          }}
          itemName={t("this_bond")}
        />
      </AnimatePresence>
    </div>
  );
}
