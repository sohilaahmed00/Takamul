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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { SalesOrder } from "@/features/sales/types/sales.types";

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
  const salesContext = useSales() || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const { data: salesOrders } = useGetAllSales();

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

  const filteredSalesOrders = salesOrders?.items
    .filter((c) => {
      const term = searchTerm.toLowerCase();

      return c.customerName?.toLowerCase().includes(term) || c.orderNumber?.includes(term) || String(c.grandTotal)?.includes(term);
    })
    ?.sort((a, b) => b.id - a.id);

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

  return (
    <div className="space-y-4 pb-12" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span className="cursor-pointer hover:text-[var(--primary)]" onClick={() => navigate("/")}>
          {t("home")}
        </span>
        <span>/</span>
        <span className="text-gray-800">{t("sales")}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المبيعات</CardTitle>
          <CardDescription>يمكنك إدارة ، إضافة ، تعديل فواتير البيع الخاصة بك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={filteredSalesOrders} paginator rows={10} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
              {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}
              <Column header={"رقم الفاتورة"} sortable field="orderNumber" />
              <Column header="التاريخ" sortable field="orderDate" body={(row) => new Date(row.orderDate).toLocaleDateString("ar-EG")} /> <Column header={t("name")} sortable field="customerName" />
              <Column header={"الكاشير"} sortable field="createdBy" />
              <Column header={"حالة الفاتورة"} sortable field="orderStatus" />
              <Column header={"المجموع الكلي"} sortable field="grandTotal" />
              <Column field="phone" header={t("phone")} />
              <Column field="taxNumber" header={t("tax_number")} />
              <Column
                header={t("actions")}
                body={(customer) => (
                  <>
                    <button onClick={async () => {}} className="btn-minimal-action btn-compact-action">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={async () => {}} className="btn-minimal-action btn-compact-action">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              />
            </DataTable>
          </div>{" "}
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>

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
      </AnimatePresence>
    </div>
  );
}
