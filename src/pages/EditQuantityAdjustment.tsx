import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit, Trash2, Bold, Italic, Underline, List,
  AlignLeft, AlignCenter, AlignRight, Search, Save, RotateCcw,
  CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useGetQuantityAdjustmentDetails } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustmentDetails";
import { useUpdateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useUpdateQuantityAdjustment";
import { useGetStockInventory } from "@/features/quantity-adjustments/hooks/useGetStockInventory";
import type {
  QuantityAdjustmentOperationType,
  QuantityAdjustmentRow,
} from "@/features/quantity-adjustments/types/adjustments.types";
import ComboboxField from "@/components/ui/ComboboxField";

import { Input } from "@/components/ui/input";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles: Record<ToastType, string> = {
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600",
  };
  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : AlertCircle;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border ${styles[type]}`}
      style={{ minWidth: 280 }}
    >
      <Icon size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="mr-auto opacity-70 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-right" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={22} className="text-yellow-500 shrink-0" />
          <p className="font-bold text-gray-800 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors">تأكيد</button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function normalizeOperationType(value: unknown): QuantityAdjustmentOperationType {
  if (value === "Add") return "Add";
  if (value === "Remove") return "Remove";
  return "Add";
}

function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.title || "حدث خطأ أثناء التحديث";
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ أثناء التحديث";
}

// ─── Component ────────────────────────────────────────────────────────────────
const EditQuantityAdjustment = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const adjustmentId = Number(id);

  const updateMutation = useUpdateQuantityAdjustment();
  const { data, isLoading, isError } = useGetQuantityAdjustmentDetails(adjustmentId);

  const [formData, setFormData] = useState({
    date: "",
    note: "",
    items: [] as QuantityAdjustmentRow[],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const seededRef = useRef(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastType) => setToast({ message, type }), []);

  // Load full inventory to get stockInventoryId from productName matching
  const { data: inventoryResponse } = useGetStockInventory({
    pageNumber: 1,
    pageSize: 500,
    search: "",
  });

  const inventoryOptions = inventoryResponse?.items ?? [];

  // ✅ Seed form from API data — items now come from bulk-adjustments which includes them
  useEffect(() => {
    if (!data || seededRef.current) return;
    // Wait for inventory to load so we can match stockInventoryId
    if (inventoryOptions.length === 0) return;
    seededRef.current = true;

    setFormData({
      date: data.operationDate
        ? new Date(data.operationDate).toLocaleString("en-GB").replace(",", "")
        : new Date().toLocaleString("en-GB").replace(",", ""),
      note: data.notes ?? "",
      items: (data.items ?? []).map((item) => {
        // Match by productName to get stockInventoryId since API doesn't return it in items
        const match = inventoryOptions.find(
          (inv) => inv.productName === item.productName
        );

        return {
          stockInventoryId: Number(match?.id ?? item.id ?? 0),
          productId: match?.productId,
          productName: item.productName ?? "",
          warehouseId: item.warehouseId ?? match?.warehouseId,
          warehouseName: match?.warehouseName ?? "",
          quantityAvailable: Number(match?.quantityAvailable ?? item.quantity ?? 0),
          operationType: normalizeOperationType(item.operationType),
          quantityChanged: Number(item.quantityChanged ?? 0),
        };
      }),
    });
  }, [data, inventoryOptions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return inventoryOptions;
    return inventoryOptions.filter((p) =>
      `${p.productName} ${p.productId ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryOptions, searchTerm]);

  const handleReset = () => setConfirmReset(true);
  const doReset = () => {
    setFormData((prev) => ({ ...prev, items: [], note: "" }));
    setConfirmReset(false);
  };

  const handleSave = async () => {
    if (formData.items.length === 0) {
      showToast("يرجى إضافة أصناف أولاً", "warning");
      return;
    }
    try {
      setSubmitError("");
      await updateMutation.mutateAsync({
        id: adjustmentId,
        payload: {
          notes: formData.note || undefined,
          items: formData.items.map((item) => ({
            stockInventoryId: item.stockInventoryId,
            operationType: item.operationType,
            quantity: item.quantityChanged,
          })),
        },
      });
      showToast("تم حفظ البيانات بنجاح!", "success");
      setTimeout(() => navigate(`/products/quantity-adjustments/view/${adjustmentId}`), 1500);
    } catch (error) {
      setSubmitError(extractErrorMessage(error));
    }
  };

  const handleAddItem = (product: any) => {
    if (formData.items.find((i) => i.stockInventoryId === product.id)) return;
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          stockInventoryId: Number(product.id),
          productId: Number(product.productId ?? 0),
          productName: product.productName,
          warehouseId: product.warehouseId,
          warehouseName: product.warehouseName,
          quantityAvailable: Number(product.quantityAvailable ?? 0),
          operationType: "Add" as QuantityAdjustmentOperationType,
          quantityChanged: 1,
        },
      ],
    }));
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleItemChange = (stockInventoryId: number, field: keyof QuantityAdjustmentRow, value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.stockInventoryId === stockInventoryId
          ? {
            ...item,
            [field]:
              field === "quantityChanged" ? Number(value)
                : field === "operationType" ? (value as QuantityAdjustmentOperationType)
                  : value,
          }
          : item
      ),
    }));
  };

  const handleRemoveItem = (stockInventoryId: number) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((i) => i.stockInventoryId !== stockInventoryId) }));
  };

  if (isLoading) return <div className="p-6 font-bold text-gray-500">جاري التحميل...</div>;
  if (isError) return <div className="p-6 font-bold text-red-500">فشل تحميل البيانات</div>;

  return (
    <div className="space-y-4 text-[var(--text-main)]" dir={direction}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmReset && (
        <ConfirmModal
          message="هل أنت متأكد من إعادة تعيين التعديلات؟"
          onConfirm={doReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium px-2">
        <span>{t("home")}</span> / <span>{t("products")}</span> /{" "}
        <span className="text-gray-800 dark:text-gray-200">تعديل التعديل الكمي</span>
      </div>

      <div className="bg-white dark:bg-[var(--bg-card)] p-4 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Edit size={20} className="text-primary" /> تعديل التعديل الكمي
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">تعديل بيانات العملية</p>
      </div>

      <div className="bg-white dark:bg-[var(--bg-card)] rounded-b-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">

        {/* Date */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("date")} *</label>
          <Input type="text" value={formData.date}  readOnly />
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("products")} *</label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Input
                type="text"
                placeholder="الرجاء إضافة الأصناف..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {showDropdown && searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-[var(--bg-card)] border border-gray-200 dark:border-gray-700 shadow-lg z-10 mt-1 rounded-md overflow-y-auto max-h-60">
                {filteredProducts.length > 0
                  ? filteredProducts.map((p) => (
                    <button key={p.id} onClick={() => handleAddItem(p)}
                      className="w-full p-3 text-right hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 font-bold text-gray-800 dark:text-gray-200">
                      {p.productName} - {p.productId}
                    </button>
                  ))
                  : <div className="p-3 text-center text-sm text-gray-500 font-bold">لا توجد نتائج</div>
                }
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <table className="w-full text-sm text-right text-[var(--text-main)] border-collapse">
            <thead className="bg-[#2ecc71] text-white">
              <tr>
                <th className="p-3 w-12 text-center border-l border-white/20">حذف</th>
                <th className="p-3 border-l border-white/20">اسم الصنف</th>
                <th className="p-3 text-center border-l border-white/20">كود الصنف</th>
                <th className="p-3 text-center border-l border-white/20">الكمية المتاحة</th>
                <th className="p-3 text-center border-l border-white/20">نوع</th>
                <th className="p-3 text-center">كمية</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[var(--bg-card)]">
              {formData.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 font-bold">
                    لا توجد أصناف مضافة — ابحث عن صنف وأضفه
                  </td>
                </tr>
              ) : (
                formData.items.map((item) => (
                  <tr key={item.stockInventoryId} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 text-center border-l border-gray-100 dark:border-gray-700">
                      <button onClick={() => handleRemoveItem(item.stockInventoryId)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-md transition-colors mx-auto block">
                        <Trash2 size={18} />
                      </button>
                    </td>
                    <td className="p-3 font-bold border-l border-gray-100 dark:border-gray-700">{item.productName}</td>
                    <td className="p-3 text-center border-l border-gray-100 dark:border-gray-700">{item.productId ?? "-"}</td>
                    <td className="p-3 text-center font-mono border-l border-gray-100 dark:border-gray-700" dir="ltr">{item.quantityAvailable}</td>
                    <td className="p-3 text-center border-l border-gray-100 dark:border-gray-700">
                      <ComboboxField
                        items={["Remove", "Add"]}
                        value={item.operationType}
                        onValueChange={(val) => handleItemChange(item.stockInventoryId, "operationType", val)}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <Input
                        type="number" min={1} value={item.quantityChanged}
                        onChange={(e) => handleItemChange(item.stockInventoryId, "quantityChanged", e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm w-16 text-center outline-none focus:border-[#2ecc71] dark:bg-[var(--input-bg)] dark:text-white font-bold"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t("note")}</label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-300 dark:border-gray-600 p-2 flex gap-1 justify-end" dir="ltr">
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><Bold size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><Italic size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><Underline size={16} /></button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 h-5 mx-2 my-auto" />
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><AlignLeft size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><AlignCenter size={16} /></button>
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><AlignRight size={16} /></button>
              <div className="w-px bg-gray-300 dark:bg-gray-600 h-5 mx-2 my-auto" />
              <button type="button" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><List size={16} /></button>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full p-4 h-24 outline-none text-right bg-white dark:bg-[var(--input-bg)] dark:text-white resize-y"
            />
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-bold">
            {submitError}
          </div>
        )}

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center justify-center gap-2 bg-[#00a651] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#008f45] transition-colors shadow-sm text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{updateMutation.isPending ? "جاري الحفظ..." : "حفظ البيانات"}</span>
            <Save size={18} />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-[#e30613] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#cc0510] transition-colors shadow-sm text-[15px]"
          >
            <span>إعادة تعيين</span>
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuantityAdjustment;