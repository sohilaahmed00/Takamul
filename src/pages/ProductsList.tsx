// src/pages/ProductsList.tsx
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Search, Edit2, Trash2, Plus, Box, Package, Layers, X, Link2, FolderPlus, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getProductsApiBase } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Product } from "@/features/products/types/products.types";
import { useGetAllProducts } from "@/features/products/hooks/useGetAllProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ===================== TYPES =====================

// ===================== API CONFIG =====================
const getBaseUrl = () => `${getProductsApiBase()}/api/Products`;
const API_ENDPOINTS = {
  get direct() {
    return `${getBaseUrl()}/direct`;
  },
  get sub() {
    return `${getBaseUrl()}/branched`;
  },
  get prepared() {
    return `${getBaseUrl()}/prepared`;
  },
  get materials() {
    return `${getBaseUrl()}/raw-material`;
  },
  getById: (id: number) => `${getBaseUrl()}/${id}`,
  update: (id: number) => `${getBaseUrl()}/${id}`,
  delete: (id: number) => `${getBaseUrl()}/${id}`,
};

// ===================== HELPERS =====================
const getName = (p: Product) => p.productNameAr || "-";
const getCode = (p: Product) => p.productCode?.toString() || p.productCode || "-";
const getCategory = (p: Product) => p.categoryName || p.categoryName || "-";

// ===================== COMPONENT =====================
export default function ProductsList() {
  const { direction, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: products } = useGetAllProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"basic" | "sub" | "prepared" | "materials">("basic");
  const [extraSearchTerm, setExtraSearchTerm] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // API State
  const [directProducts, setDirectProducts] = useState<Product[]>([]);
  const [subProducts, setSubProducts] = useState<Product[]>([]);
  const [preparedProducts, setPreparedProducts] = useState<Product[]>([]);
  const [materialsProducts, setMaterialsProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===================== FETCH =====================
  const fetchProducts = useCallback(async (tab: typeof activeTab) => {
    setLoading(true);
    setError(null);
    try {
      const url = tab === "basic" ? API_ENDPOINTS.direct : tab === "sub" ? API_ENDPOINTS.sub : tab === "prepared" ? API_ENDPOINTS.prepared : API_ENDPOINTS.materials;

      const token = localStorage.getItem("takamul_token");
      const res = await fetch(url, {
        headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Product[] = await res.json();

      if (tab === "basic") setDirectProducts(data);
      else if (tab === "sub") setSubProducts(data);
      else if (tab === "prepared") setPreparedProducts(data);
      else setMaterialsProducts(data);
    } catch (err: any) {
      setError("فشل تحميل البيانات: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tabs on mount
  useEffect(() => {
    fetchProducts("basic");
    fetchProducts("sub");
    fetchProducts("prepared");
    fetchProducts("materials");
  }, [fetchProducts]);

  useEffect(() => {
    if (location.state?.refreshed) {
      fetchProducts(activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-container") && !target.closest(".action-menu-dropdown")) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ===================== DERIVED DATA =====================
  const activeData = activeTab === "basic" ? directProducts : activeTab === "sub" ? subProducts : activeTab === "prepared" ? preparedProducts : materialsProducts;

  const currentTableData = activeData.filter((item: Product) => {
    const nameMatch = getName(item).toLowerCase().includes(searchTerm.toLowerCase());
    const codeMatch = getCode(item).toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || codeMatch;
  });

  const availableDirectProducts = directProducts.filter((item: Product) => getName(item).toLowerCase().includes(extraSearchTerm.toLowerCase()) || getCategory(item).toLowerCase().includes(extraSearchTerm.toLowerCase()));

  const availableSubAsCategories = subProducts.filter((item: Product) => getName(item).toLowerCase().includes(extraSearchTerm.toLowerCase()));

  // ===================== HANDLERS =====================
  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
    setActiveActionMenu(null);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;
    try {
      const res = await fetch(API_ENDPOINTS.delete(selectedProductId), { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Refresh current tab
      fetchProducts(activeTab);
    } catch (err: any) {
      setError("فشل الحذف: " + err.message);
    }
    setShowDeleteModal(false);
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/edit/${product.id}`, {
      state: { productNature: activeTab, productData: product },
    });
  };

  const openLinkModal = (id: number) => {
    setSelectedProductId(id);
    setExtraSearchTerm("");
    setShowLinkModal(true);
    setActiveActionMenu(null);
  };

  const handleLinkSubProduct = async (directProduct: Product) => {
    if (!selectedProductId) return;
    const subProduct = subProducts.find((p: Product) => p.id === selectedProductId);
    if (!subProduct) return;

    try {
      const updated = {
        ...subProduct,
        parentProductId: directProduct.id,
        parentProductName: getName(directProduct),
      };
      const res = await fetch(API_ENDPOINTS.update(selectedProductId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchProducts("sub");
    } catch (err: any) {
      setError("فشل الربط: " + err.message);
    }
    setShowLinkModal(false);
  };

  const openAddCategoryModal = (id: number) => {
    setSelectedProductId(id);
    setExtraSearchTerm("");
    setShowAddCategoryModal(true);
    setActiveActionMenu(null);
  };

  // ===================== UI HELPERS =====================
  if (loading && activeData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction || "rtl"}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case "basic":
        return "الأصناف المباشرة";
      case "sub":
        return "الأصناف المتفرعة";
      case "prepared":
        return "الأصناف المجهزة";
      case "materials":
        return "الخامات";
    }
  };

  return (
    <div className="space-y-6 pb-12" dir={direction || "rtl"}>
      {/* الهيدر */}
      <div className="takamol-page-header">
        <div className="flex items-center gap-3">
          <div className="bg-[#e6f4ea] border border-[#00a651]/20 p-2.5 rounded-xl text-[var(--primary)]">
            <Box size={24} />
          </div>
          <div>
            <h1 className="takamol-page-title">إدارة الأصناف</h1>
            <p className="takamol-page-subtitle">إدارة الأصناف المباشرة والمتفرعة والمجهزة والخامات</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fetchProducts(activeTab)} className="btn-secondary flex items-center gap-2" title="تحديث البيانات">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => navigate("/products/create", { state: { productNature: activeTab } })} className="btn-primary">
            <Plus size={18} /> إضافة صنف
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* السايدبار */}
        {/* <div className="w-full md:w-1/4 space-y-3">
          {(
            [
              { tab: "basic", icon: <Box size={20} />, label: "الأصناف المباشرة", count: directProducts.length },
              { tab: "sub", icon: <Layers size={20} />, label: "الأصناف المتفرعة", count: subProducts.length },
              { tab: "prepared", icon: <Package size={20} />, label: "الأصناف المجهزة", count: preparedProducts.length },
              { tab: "materials", icon: <FolderPlus size={20} />, label: "الخامات", count: materialsProducts.length },
            ] as const
          ).map(({ tab, icon, label, count }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm("");
              }}
              className={cn("w-full flex items-center justify-between gap-3 p-4 rounded-xl font-bold transition-all border", activeTab === tab ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
            >
              <div className="flex items-center gap-2">
                {icon} {label}
              </div>
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500")}>{count}</span>
            </button>
          ))}
        </div> */}

        {/* المحتوى الرئيسي */}
        <div className="w-full  bg-white rounded-xl  border border-gray-200 p-6">
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {getTabIcon()}
              {getTabTitle()}
              <span className="mr-2 text-sm text-gray-500">({currentTableData.length})</span>
            </h2>
            <div className="relative w-72">
              <input type="text" placeholder="ابحث بالاسم أو الكود..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="takamol-input pr-10" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div> */}
          <Tabs defaultValue="allProducts" className="w-full">
            <TabsList className="gap-x-8 h-fit! mb-4">
              <TabsTrigger className="py-2!" value="allProducts">
                جميع الأصناف
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="directed">
                الأصناف المباشرة
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="branched">
                الأصناف المتفرعة
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="prepared">
                الأصناف المجهزة
              </TabsTrigger>
              <TabsTrigger className="py-2!" value="rawMaterials">
                الخامات
              </TabsTrigger>
            </TabsList>
            <TabsContent value="allProducts">
              {" "}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <DataTable responsiveLayout="stack" className="custom-green-table custom-compact-table" value={products?.items} paginator rows={entriesPerPage} first={(currentPage - 1) * entriesPerPage} onPage={(e) => setCurrentPage(e.page + 1)} dataKey="id" stripedRows={false} /* في هذا التصميم، من الأفضل إيقاف stripedRows للحفاظ على البساطة */>
                  {/* <Column selectionMode="multiple" headerStyle={{ width: "2rem" }}></Column> */}
                  <Column
                    header={t("name")}
                    sortable
                    body={(pro: Product) => (
                      <div className="cell-data-stack">
                        {" "}
                        <span className="customer-name-main">{pro.productNameAr}</span>
                      </div>
                    )}
                  />

                  <Column field="description" header={t("description")} />
                  <Column
                    header={t("actions")}
                    body={(product: Product) => (
                      <>
                        <Link to={`/products/edit/${product?.id}`} className="btn-minimal-action btn-compact-action">
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={async () => {
                            // const res = await deleteCustomer(category?.id);
                          }}
                          className="btn-minimal-action btn-compact-action"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  />
                </DataTable>
              </div>
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* القائمة المنسدلة */}
      {activeActionMenu &&
        menuPosition &&
        createPortal(
          <div style={{ position: "absolute", top: menuPosition.top, left: menuPosition.left, transform: "translateX(-50%)", zIndex: 99999 }} className="w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1 action-menu-dropdown" dir="rtl">
            <button
              onClick={() => {
                const allProducts = [...directProducts, ...subProducts, ...preparedProducts, ...materialsProducts];
                const product = allProducts.find((p: Product) => p.id === selectedProductId);
                if (product) handleEditProduct(product);
                setActiveActionMenu(null);
              }}
              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 size={16} className="text-green-600" /> تعديل
            </button>

            {activeTab === "sub" && (
              <>
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => openLinkModal(selectedProductId!)} className="w-full px-4 py-2.5 text-sm text-orange-700 hover:bg-orange-50 flex items-center gap-2">
                  <Link2 size={16} /> ربط بصنف مباشر
                </button>
              </>
            )}

            {activeTab === "basic" && (
              <>
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => openAddCategoryModal(selectedProductId!)} className="w-full px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2">
                  <FolderPlus size={16} /> إضافة قسم
                </button>
              </>
            )}

            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => {
                openDeleteModal(selectedProductId!);
                setActiveActionMenu(null);
              }}
              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 size={16} /> حذف
            </button>
          </div>,
          document.body,
        )}

      {/* نافذة الربط */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowLinkModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                  <Layers size={20} /> اختر الصنف المباشر للربط
                </h2>
                <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-orange-400 transition-colors shadow-sm">
                  <Search className="text-gray-400 shrink-0 ml-2" size={16} />
                  <input type="text" placeholder="ابحث عن صنف مباشر..." value={extraSearchTerm} onChange={(e) => setExtraSearchTerm(e.target.value)} autoFocus className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700" />
                </div>
              </div>
              <div className="p-4 overflow-y-auto max-h-80 space-y-2">
                {availableDirectProducts.map((dp: Product) => (
                  <div key={dp.id} className="flex items-center justify-between p-3 border rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => handleLinkSubProduct(dp)}>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{getName(dp)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        كود: {getCode(dp)} | قسم: {getCategory(dp)}
                      </p>
                    </div>
                    <button className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors flex items-center gap-1">
                      <Link2 size={14} /> ربط
                    </button>
                  </div>
                ))}
                {availableDirectProducts.length === 0 && <p className="text-center text-sm text-gray-500 py-6">لا توجد أصناف مباشرة مطابقة</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة قسم */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowAddCategoryModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-purple-50">
                <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                  <FolderPlus size={20} /> اختر قسماً لإضافته
                </h2>
                <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-purple-400 transition-colors shadow-sm">
                  <Search className="text-gray-400 shrink-0 ml-2" size={16} />
                  <input type="text" placeholder="ابحث عن قسم..." value={extraSearchTerm} onChange={(e) => setExtraSearchTerm(e.target.value)} autoFocus className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700" />
                </div>
              </div>
              <div className="p-4 overflow-y-auto max-h-80 space-y-2">
                {availableSubAsCategories.map((sp: Product) => {
                  const directProduct = directProducts.find((p: Product) => p.id === selectedProductId);
                  const isAlreadyAdded = directProduct?.categoryName
                    ?.split(",")
                    .map((c: string) => c.trim())
                    .includes(getName(sp));
                  return (
                    <div key={sp.id} className={cn("flex items-center justify-between p-3 border rounded-xl bg-white transition-all cursor-pointer", isAlreadyAdded ? "border-gray-200 bg-gray-50 opacity-60" : "hover:border-purple-300 hover:shadow-sm")}>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{getName(sp)}</p>
                        <p className="text-xs text-gray-500 mt-1">الصنف المتفرع</p>
                      </div>
                      <button onClick={() => !isAlreadyAdded && handleAddCategory(sp)} disabled={isAlreadyAdded} className={cn("px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors", isAlreadyAdded ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-purple-100 text-purple-700 hover:bg-purple-200")}>
                        <FolderPlus size={14} /> {isAlreadyAdded ? "مضاف" : "إضافة"}
                      </button>
                    </div>
                  );
                })}
                {availableSubAsCategories.length === 0 && <p className="text-center text-sm text-gray-500 py-6">لا توجد أقسام متاحة</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة تأكيد الحذف */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={30} />
              </div>
              <h2 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h2>
              <p className="text-gray-500 mb-6 text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">
                  إلغاء
                </button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===================== ACTION BUTTON =====================
function ActionButton({ id, activeActionMenu, setActiveActionMenu, setMenuPosition, setSelectedProductId }: { id: number; activeActionMenu: number | null; setActiveActionMenu: (id: number | null) => void; setMenuPosition: (pos: { top: number; left: number }) => void; setSelectedProductId: (id: number) => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + rect.width / 2 });
        setActiveActionMenu(activeActionMenu === id ? null : id);
        setSelectedProductId(id);
      }}
      className="bg-[var(--primary)] text-white px-3 py-1.5 rounded text-sm font-bold"
    >
      خيارات
    </button>
  );
}
