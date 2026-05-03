import React, { useMemo, useState } from "react";
import { Search, Edit2, Trash2, Plus, Tag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CategoryDiscount as ICategoryDiscount } from "@/features/category-discount/types/category-discount.types";
import AddCategoryDiscountModal from "@/components/modals/AddCategoryDiscountModal";
import DeleteTreasuryDialog from "@/components/modals/DeleteTreasuryDialog";
import { useDeactivateCategoryDiscount, useGetAllCategoryDiscounts } from "@/features/category-discount/hooks/useCategoryDiscount";

const CategoryDiscount: React.FC = () => {
  const { t, direction } = useLanguage();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState<number | undefined>();
  const [discountToDeleteId, setDiscountToDeleteId] = useState<number | undefined>();
  
  const { mutate: deactivateDiscount, isPending: isDeactivating } = useDeactivateCategoryDiscount();

  const { data: discountsResponse, isLoading } = useGetAllCategoryDiscounts({
    IsActive: true,
    PageSize: 100,
  });

  const discounts = discountsResponse?.items || [];

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
    <div className="p-0" dir={direction}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <Tag size={20} className="text-[var(--primary)]" />
            {t("category_discounts", "خصومات التصنيفات")}
          </CardTitle>
          <CardDescription>{t("manage_category_discounts_desc", "إدارة خصومات التصنيفات وتحديد القيم لكل تصنيف")}</CardDescription>
          <CardAction>
            <Button size="xl" variant="default" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              {t("add_category_discount", "إضافة خصم تصنيف")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          <DataTable 
            value={discounts} 
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
            <Column field="id" header={"#"} sortable style={{ width: "10%" }} />
            <Column field="categoryNameAr" header={t("category", "التصنيف")} sortable style={{ width: "35%" }} />
            <Column 
              field="discountValue" 
              header={t("discount_value", "قيمة الخصم")} 
              sortable 
              style={{ width: "15%" }} 
              body={(row: ICategoryDiscount) => (
                <div className="font-bold text-[var(--primary)]">
                  {row.discountValue} {row.discountType === "Percentage" ? "%" : t("sar", "ر.س")}
                </div>
              )}
            />
            <Column field="discountTypeLabel" header={t("type", "النوع")} sortable style={{ width: "20%" }} />
            <Column
              header={t("actions", "عمليات")}
              style={{ width: "20%" }}
              body={(discount: ICategoryDiscount) => (
                <div className="space-x-2 flex items-center">
                  <button
                    onClick={() => {
                      setSelectedDiscountId(discount.id);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      setDiscountToDeleteId(discount.id);
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

      <AddCategoryDiscountModal
        discount={discounts.find((d) => d.id === selectedDiscountId)}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDiscountId(undefined);
        }}
      />

      <DeleteTreasuryDialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDiscountToDeleteId(undefined);
        }}
        onConfirm={() => {
          if (discountToDeleteId) {
            deactivateDiscount(discountToDeleteId, {
              onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDiscountToDeleteId(undefined);
              }
            });
          }
        }}
        itemName={discounts.find((d) => d.id === discountToDeleteId)?.categoryNameAr}
        itemLabel={t("category_discount") || "خصم التصنيف"}
        loading={isDeactivating}
      />
    </div>
  );
};

export default CategoryDiscount;
