// src/pages/ProductsList.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal, prefetchDNS } from "react-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Search, Edit2, Trash2, Plus, Box, Package, Layers, X, Link2, FolderPlus, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getProductsApiBase } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable, type DataTableFilterMeta, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Product } from "@/features/products/types/products.types";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetAllProductsDirect } from "@/features/products/hooks/useGetAllProductsDirect";
import { useGetAllProductsBranched } from "@/features/products/hooks/useGetAllProductsBranched";
import { useGetAllProductsRawMatrial } from "@/features/products/hooks/useGetAllProductsRawMatrial";
import { useGetAllProductsPrepared } from "@/features/products/hooks/useGetAllProductsPrepared";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteCustomer";

export default function ProductsList() {
  const { direction, t } = useLanguage();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("allProducts");
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { data: products, isLoading } = useGetAllProducts(
    {
      page: currentPage,
      limit: entriesPerPage,
      SearchTerm: globalFilterValue,
    },
    {
      enabled: activeTab === "allProducts",
    },
  );

  const { data: productsDirect } = useGetAllProductsDirect(
    {
      page: currentPage,
      limit: entriesPerPage,
      SearchTerm: globalFilterValue,
    },
    {
      enabled: activeTab === "Direct",
    },
  );

  const { data: productsBranched } = useGetAllProductsBranched(
    {
      page: currentPage,
      limit: entriesPerPage,
      SearchTerm: globalFilterValue,
    },
    {
      enabled: activeTab === "Branched",
    },
  );
  const { data: productsPrepared } = useGetAllProductsPrepared(
    {
      page: currentPage,
      limit: entriesPerPage,
      SearchTerm: globalFilterValue,
    },
    {
      enabled: activeTab === "Prepared",
    },
  );

  const { data: productsRawMaterials } = useGetAllProductsRawMatrial(
    {
      page: currentPage,
      limit: entriesPerPage,
      SearchTerm: globalFilterValue,
    },
    {
      enabled: activeTab === "RawMatrial",
    },
  );
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setCurrentPage(1);
  };
  const handleTabChange = (newTab: string) => {
    console.log(activeTab);
    setActiveTab(newTab);
    setGlobalFilterValue("");
    setCurrentPage(1);
  };
  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4  items-center">
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
  const currentTableData = useMemo(() => {
    switch (activeTab) {
      case "allProducts":
        return {
          items: products?.items || [],
          total: products?.totalCount || 0,
          loading: !products?.items,
        };

      case "Direct":
        return {
          items: productsDirect?.items || [],
          total: productsDirect?.totalCount || 0,
          loading: !productsDirect?.items,
        };

      case "Branched":
        return {
          items: productsBranched?.items || [],
          total: productsBranched?.totalCount || 0,
          loading: !productsBranched?.items,
        };

      case "Prepared":
        return {
          items: productsPrepared?.items || [],
          total: productsPrepared?.totalCount || 0,
          loading: !productsPrepared?.items,
        };

      case "RawMatrial":
        return {
          items: productsRawMaterials?.items || [],
          total: productsRawMaterials?.totalCount || 0,
          loading: !productsRawMaterials?.items,
        };
      default:
        return { items: [], total: 0, loading: false };
    }
  }, [activeTab, products, productsDirect, productsBranched, productsPrepared, productsRawMaterials]);
  return (
    <>
      <Card>
        <CardHeader className="max-md:flex max-md:flex-col">
          <CardTitle>إدارة الاصناف</CardTitle>
          <CardDescription>إدارة الأصناف المباشرة والمتفرعة والمجهزة والخامات</CardDescription>
          <CardAction className="max-md:flex max-md:justify-end max-md:mt-2">
            <Button size={"xl"} variant={"default"} asChild>
              <Link to={"/products/create"}>إضافة صنف</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="border border-gray-200 rounded-t-md overflow-hidden">
            <TabsList variant={"line"} className="flex overflow-x-auto justify-start gap-x-2 md:gap-x-8 h-fit! pb-1 max-lg:w-full [&::-webkit-scrollbar]:hidden">
              <TabsTrigger className="py-2! whitespace-nowrap shrink-0" value="allProducts">
                جميع الأصناف
              </TabsTrigger>
              <TabsTrigger className="py-2! whitespace-nowrap shrink-0" value="Direct">
                الأصناف المباشرة
              </TabsTrigger>
              <TabsTrigger className="py-2! whitespace-nowrap shrink-0" value="Branched">
                الأصناف المتفرعة
              </TabsTrigger>
              <TabsTrigger className="py-2! whitespace-nowrap shrink-0" value="Prepared">
                الأصناف المجهزة
              </TabsTrigger>
              <TabsTrigger className="py-2! whitespace-nowrap shrink-0" value="RawMatrial">
                الخامات
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DataTable
            value={currentTableData.items}
            totalRecords={currentTableData.total}
            loading={currentTableData.loading}
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
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
          >
            <Column header={t("name")} sortable field="productNameAr" />
            <Column field="description" sortable header={t("description")} />
            <Column field="balance" sortable header={"الكمية"} />
            <Column field="costPrice" sortable header={"سعر الشراء"} />
            <Column
              header="قيمة الضريبة"
              body={(row: Product) => {
                const qty = row.balance > 0 ? row.balance : 1;
                const price = row.sellingPrice * qty;
                const rate = row.taxAmount / 100;

                let tax = 0;

                if (row.taxCalculation === 1) {
                  tax = 0;
                } else if (row.taxCalculation === 2) {
                  tax = price - price / (1 + rate);
                } else if (row.taxCalculation === 3) {
                  tax = price * rate;
                }

                return tax.toFixed(2);
              }}
            />
            <Column field="sellingPrice" sortable header={"سعر البيع"} />

            <Column field="productType" sortable header={"النوع"} />
            <Column
              header={t("actions")}
              body={(product: Product) => (
                <div className="space-x-2">
                  <Link to={`/products/edit/${product?.id}?type=${activeTab == "allProducts" ? product?.productType : activeTab}`} className="btn-minimal-action btn-edit">
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={async () => {
                      await deleteProduct(product?.id);
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
      <style>
        {`
    .p-datatable-header {
      border-top:none !important;
       border-top-left-radius: 0px;
  border-top-right-radius: 0px;
    }
  `}
      </style>{" "}
    </>
  );
}
