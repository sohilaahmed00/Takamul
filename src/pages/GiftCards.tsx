import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Gift, Plus, Trash2, Search, Edit2, Eye, Loader2, AlertTriangle, X, Settings, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useGetGiftCards } from "@/features/gift-cards/hooks/useGetGiftCards";
import { useDeleteGiftCard } from "@/features/gift-cards/hooks/useDeleteGiftCard";
import type { GiftCard, GiftCardApi } from "@/features/gift-cards/types/giftCard.types";
import { httpClient } from "@/api/httpClient";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import formatDate from "@/lib/formatDate";
import AddGiftCardModal from "@/components/modals/AddGiftCardModal";

import { Input } from "@/components/ui/input";

export default function GiftCards() {
  const { direction, t } = useLanguage();

  const { mutate: deleteGiftCard } = useDeleteGiftCard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { data: giftCards, isPending, isLoading, refetch } = useGetGiftCards({ page: currentPage, limit: entriesPerPage, SearchTerm: globalFilterValue });
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
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
          <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="placeholder:font-normal w-full border border-gray-200 hover:border-gray-200 focus:border-[var(--primary)] focus:bg-white text-gray-700 text-sm rounded-lg py-2 pr-11 pl-4 transition-all outline-none" />
        </div>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: GiftCard) => {
    const isActive = rowData?.isActive;

    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${isActive ? `text-[#09ad95] bg-[#00e6821a]` : `text-[#b40b09] bg-[#f50b0b1a]`}`}>{isActive ? "نشط" : "غير نشط"}</span>;
  };

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);
  return (
    <>
      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>{t("gift_cards_list") || "قائمة كروت الهدايا"}</CardTitle>
          <CardDescription>{t("manage_gift_cards") || "إدارة كروت الهدايا"}</CardDescription>
          <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
            <Button size="xl" variant={"default"} onClick={() => setIsAddModalOpen(true)}>
              {t("add_gift_card") || "إضافة كارت هدية"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={giftCards?.items || []}
            rowsPerPageOptions={[5, 10, 20, 50]}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={giftCards?.totalCount || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!giftCards?.items}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
          >
            <Column header={t("card_no") || "رقم الكارت"} sortable field="code" />
            <Column header={t("amount") || "القيمة"} field="initialAmount" sortable />
            <Column header={t("remaining_amount") || "المبلغ المتبقي"} field="remainingAmount" sortable />
            <Column header={t("customer") || "العميل"} body={(raw: GiftCard) => <span>{raw?.customerName}</span>} sortable />
            <Column header={t("expiry_date") || "تاريخ الانتهاء"} field="expiryDate" body={(raw: GiftCard) => <span>{formatDate(raw?.expiryDate ?? "")}</span>} sortable />
            <Column header={t("status") || "الحالة"} field="isActive" body={(rawData) => statusBodyTemplate(rawData)} sortable />
            <Column header={t("notes") || "ملاحظات"} field="notes" />
            <Column
              header={t("actions")}
              body={(giftCard: GiftCard) => (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedGiftCard(giftCard);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action btn-edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      deleteGiftCard(giftCard?.id);
                    }}
                    className="btn-minimal-action btn-delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>
      <AddGiftCardModal
        giftCard={selectedGiftCard}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedGiftCard(null);
        }}
      />
    </>
  );
}
