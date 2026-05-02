import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DeliveryCompany } from "@/features/delivery-companies/types/delivery-companies.types";
import AddDeliveryCompanyModal from "@/components/modals/AddDeliveryCompanyModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import { useDeleteDeliveryCompany } from "@/features/delivery-companies/hooks/useDeleteDeliveryCompany";
import { useGetAllDeliveryCompanies } from "@/features/delivery-companies/hooks/useGetAllDeliveryCompanies";

const DeliveryCompanies: React.FC = () => {
  const { t, direction } = useLanguage();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<number | undefined>();
  const [companyToDelete, setCompanyToDelete] = useState<number | undefined>();
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteDeliveryCompany();

  const { data: companiesResponse, isLoading } = useGetAllDeliveryCompanies({
    SearchTerm: globalFilterValue,
    PageSize: 100, // For now, simple list
  });

  const companies = companiesResponse?.data?.items || [];

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
          <CardTitle>{t("delivery_companies", "شركات التوصيل")}</CardTitle>
          <CardDescription>{t("customize_report_below", "يمكنك تخصيص التقرير أدناه")}</CardDescription>
          <CardAction>
            <Button size="xl" variant="default" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              {t("add_delivery_company", "إضافة شركة توصيل")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable value={companies} loading={isLoading} header={header} paginator rows={10} responsiveLayout="stack" className="custom-green-table custom-compact-table" dataKey="id" stripedRows={false} emptyMessage={t("no_data") || "لا توجد بيانات"}>
            <Column field="id" header={"#"} sortable style={{ width: "10%" }} />
            <Column field="name" header={t("company_name", "اسم الشركة")} sortable style={{ width: "65%" }} />
            <Column
              header={t("actions", "عمليات")}
              style={{ width: "25%" }}
              body={(company: DeliveryCompany) => (
                <div className="space-x-2 flex items-center">
                  <button
                    onClick={() => {
                      setSelectedCompany(company.id);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      setCompanyToDelete(company.id);
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

      <AddDeliveryCompanyModal
        company={companies.find((c) => c.id === selectedCompany)}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCompany(undefined);
        }}
      />

      <DeleteTreasuryDialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompanyToDelete(undefined);
        }}
        onConfirm={() => {
          if (companyToDelete) {
            deleteCompany(companyToDelete, {
              onSuccess: () => {
                setIsDeleteModalOpen(false);
                setCompanyToDelete(undefined);
              }
            });
          }
        }}
        itemName={companies.find((c) => c.id === companyToDelete)?.name}
        itemLabel={t("delivery_company") || "شركة التوصيل"}
        loading={isDeleting}
      />
    </div>
  );
};

export default DeliveryCompanies;
