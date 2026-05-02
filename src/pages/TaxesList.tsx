import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tax } from "@/features/taxes/types/taxes.types";
import AddTaxModal from "@/components/modals/AddTaxModal.tsx";
import { useDeleteTax } from "@/features/taxes/hooks/useDeleteTax";
import { useGetAllTaxes } from "@/features/taxes/hooks/useGetAllTaxes";

export default function TaxesList() {
  const { t, direction } = useLanguage();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<number | undefined>();
  const { mutate: deleteTax } = useDeleteTax();

  const { data: taxes, isLoading } = useGetAllTaxes();

  const filteredTaxes = useMemo(() => {
    if (!taxes) return [];
    if (!globalFilterValue) return taxes;
    return taxes.filter((tax) => tax.name.toLowerCase().includes(globalFilterValue.toLowerCase()));
  }, [taxes, globalFilterValue]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="pr-11" />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("tax_list", "قائمة الضرايب")}</CardTitle>
          <CardDescription>{t("customize_report_below", "يمكنك تخصيص التقرير أدناه")}</CardDescription>
          <CardAction>
            <Button size="xl" variant="default" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              {t("add_tax", "إضافة ضريبة")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable value={filteredTaxes} loading={isLoading} header={header} paginator rows={10} responsiveLayout="stack" className="custom-green-table custom-compact-table" dataKey="id" stripedRows={false}>
            <Column field="id" header={"#"} sortable style={{ width: "10%" }} />
            <Column field="name" header={t("tax_name", "اسم الضريبة")} sortable style={{ width: "40%" }} />
            <Column field="amount" header={t("tax_amount", "القيمة")} sortable style={{ width: "25%" }} body={(tax: Tax) => <span>{tax.amount}%</span>} />
            <Column
              header={t("promotion_actions", "الإجراءات")}
              style={{ width: "25%" }}
              body={(tax: Tax) => (
                <div className="space-x-2 flex items-center">
                  <button
                    onClick={() => {
                      setSelectedTax(tax.id);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteTax(tax.id)} className="btn-minimal-action">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      <AddTaxModal
        tax={taxes?.find((t) => t.id === selectedTax)}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedTax(undefined);
        }}
      />
    </div>
  );
}
