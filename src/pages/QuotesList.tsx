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
import formatDate from "@/lib/formatDate";

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
          <input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };
  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>{t("quotes")}</CardTitle>
        <CardDescription>{t("quotes_desc")}</CardDescription>
        <CardAction>
          <Button size="xl" variant={"default"} asChild>
            <Link to={"/quotes/create"}>{t("add_quote")}</Link>
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
          <Column header={t("invoice_number")} sortable field="quotationNumber" />
          <Column header={t("date")} sortable field="quotationDate" body={(row) => formatDate(row.quotationDate)} />
          <Column header={t("customer_name")} sortable field="customerName" />
          <Column header={t("cashier")} sortable field="createdBy" />
          <Column header={t("quote_status")} sortable field="status" />
          <Column header={t("subtotal")} sortable field="subTotal" />
          <Column header={t("tax_amount")} sortable field="taxAmount" />
          <Column header={t("discount_amount")} sortable field="discountAmount" />
          <Column header={t("total_amount")} sortable field="grandTotal" />
          <Column
            header={t("actions")}
            body={(row) => (
              <div className="flex gap-2">
                <button onClick={() => { }} className="btn-minimal-action btn-compact-action">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => { }} className="btn-minimal-action btn-compact-action text-red-500">
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