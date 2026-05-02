import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Currency } from "@/features/currencies/types/currencies.types";
import AddCurrencyModal from "@/components/modals/AddCurrencyModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import { useGetAllCurrencies } from "@/features/currencies/hooks/useGetAllCurrencies";
import { useDeleteCurrency } from "@/features/currencies/hooks/useDeleteCurrency";
import { useSetDefaultCurrency } from "@/features/currencies/hooks/useSetDefaultCurrency";

export default function Currencies() {
  const { t, direction } = useLanguage();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | undefined>();
  const [currencyToDelete, setCurrencyToDelete] = useState<number | undefined>();

  const { data: response, isLoading } = useGetAllCurrencies({
    SearchTerm: globalFilterValue,
  });

  const { mutate: deleteCurrency } = useDeleteCurrency();
  const { mutate: setDefaultCurrency } = useSetDefaultCurrency();

  const currencies = response?.data?.items || [];

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  const defaultBody = (currency: Currency) => (
    <div className="flex items-center gap-2">
      {currency.isDefault ? (
        <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
          <CheckCircle2 size={16} />
          {t("default_option") || "الافتراضية"}
        </span>
      ) : (
        <button
          onClick={() => setDefaultCurrency(currency.id)}
          className="text-xs text-gray-400 hover:text-[var(--primary)] transition-colors underline"
        >
          {t("set_as_default") || "تعيين كافتراضية"}
        </button>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input
          type="text"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder={t("search_placeholder")}
          className="pr-11 h-11"
        />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  const selectedCurrency = currencies.find((c) => c.id === selectedCurrencyId);

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("currencies") || "العملات"}</CardTitle>
          <CardDescription>{t("manage_currencies_desc") || "إدارة العملات المتاحة في النظام"}</CardDescription>
          <CardAction>
            <Button
              size="xl"
              variant="default"
              onClick={() => {
                setSelectedCurrencyId(undefined);
                setIsModalOpen(true);
              }}
            >
              <Plus size={20} />
              {t("add_currency") || "إضافة عملة"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable
            value={currencies}
            loading={isLoading}
            header={header}
            paginator
            rows={10}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
            emptyMessage={t("no_data") || "لا توجد بيانات"}
          >
            <Column field="id" header={t("id")} sortable style={{ width: "10%" }} />
            <Column field="name" header={t("currency_name")} sortable style={{ width: "25%" }} />
            <Column field="code" header={t("currency_code")} sortable style={{ width: "20%" }} />
            <Column field="symbol" header={t("currency_symbol")} sortable style={{ width: "15%" }} />
            <Column header={t("default_option") || "الافتراضية"} style={{ width: "15%" }} body={defaultBody} />
            <Column
              header={t("actions")}
              style={{ width: "15%" }}
              body={(currency: Currency) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCurrencyId(currency.id);
                      setIsModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrencyToDelete(currency.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      <AddCurrencyModal
        currency={selectedCurrency}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCurrencyId(undefined);
        }}
      />

      <DeleteTreasuryDialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCurrencyToDelete(undefined);
        }}
        onConfirm={() => {
          if (currencyToDelete) {
            deleteCurrency(currencyToDelete);
            setIsDeleteModalOpen(false);
          }
        }}
        itemName={currencies.find((c) => c.id === currencyToDelete)?.name}
        itemLabel={t("currency") || "العملة"}
      />
    </div>
  );
}
