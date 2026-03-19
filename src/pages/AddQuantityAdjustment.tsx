import React, { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { useCreateQuantityAdjustment } from "@/features/quantity-adjustments/hooks/useCreateQuantityAdjustment";
import { useGetStockInventory } from "@/features/quantity-adjustments/hooks/useGetStockInventory";
import type {
  QuantityAdjustmentOperationType,
  QuantityAdjustmentRow,
} from "@/features/quantity-adjustments/types/adjustments.types";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles: Record<ToastType, string> = {
    success: "bg-green-600 border-green-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-yellow-500 border-yellow-600",
  };

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? XCircle : AlertCircle;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border ${styles[type]} animate-in fade-in slide-in-from-top-2 duration-300`}
      style={{ minWidth: 280 }}
    >
      <Icon size={20} className="shrink-0" />
      <span className="font-bold text-sm">{message}</span>
      <button
        onClick={onClose}
        className="mr-auto opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-right" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={22} className="text-yellow-500 shrink-0" />
          <p className="font-bold text-gray-800 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      "حدث خطأ أثناء الحفظ"
    );
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ أثناء الحفظ";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AddQuantityAdjustment() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const createMutation = useCreateQuantityAdjustment();

  const [formData, setFormData] = useState({
    date: new Date().toLocaleString("en-GB").replace(",", ""),
    note: "",
    items: [] as QuantityAdjustmentRow[],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: ToastType) =>
    setToast({ message, type });

  const { data: inventoryResponse, isLoading: inventoryLoading } =
    useGetStockInventory({ pageNumber: 1, pageSize: 100, search: searchTerm });

  const inventoryOptions = inventoryResponse?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return inventoryOptions;
    return inventoryOptions.filter((p) =>
      `${p.productName} ${p.productId ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [inventoryOptions, searchTerm]);

  const handleReset = () => setConfirmReset(true);

  const doReset = () => {
    setFormData({
      date: new Date().toLocaleString("en-GB").replace(",", ""),
      note: "",
      items: [],
    });
    setSubmitError("");
    setConfirmReset(false);
  };

  const handleAddItem = (product: any) => {
    const existingItem = formData.items.find(
      (item) => item.stockInventoryId === product.id
    );
    if (existingItem) return;

    const newItem: QuantityAdjustmentRow = {
      stockInventoryId: Number(product.id),
      productId: Number(product.productId ?? 0),
      productName: product.productName,
      warehouseId: product.warehouseId,
      warehouseName: product.warehouseName,
      quantityAvailable: Number(product.quantityAvailable ?? 0),
      operationType: "Remove",
      quantityChanged: 1,
    };

    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleItemChange = (
    stockInventoryId: number,
    field: keyof QuantityAdjustmentRow,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.stockInventoryId === stockInventoryId
          ? {
              ...item,
              [field]:
                field === "quantityChanged"
                  ? Number(value)
                  : field === "operationType"
                  ? (value as QuantityAdjustmentOperationType)
                  : value,
            }
          : item
      ),
    }));
  };

  const handleRemoveItem = (stockInventoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.stockInventoryId !== stockInventoryId),
    }));
  };

  const handleComplete = async () => {
    if (formData.items.length === 0) {
      showToast("يرجى إضافة أصناف أولاً", "warning");
      return;
    }

    setSubmitError("");

    try {
      await createMutation.mutateAsync({
        notes: formData.note || undefined,
        items: formData.items.map((item) => ({
          stockInventoryId: item.stockInventoryId,
          operationType: item.operationType,
          quantity: item.quantityChanged,
        })),
      });

      showToast("تم حفظ البيانات بنجاح!", "success");
      setTimeout(() => navigate("/products/quantity-adjustments"), 1500);
    } catch (error) {
      setSubmitError(extractErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4 text-black" dir={direction}>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Reset Modal */}
      {confirmReset && (
        <ConfirmModal
          message={
            direction === "rtl"
              ? "هل أنت متأكد من إعادة تعيين الصفحة؟"
              : "Are you sure you want to reset?"
          }
          onConfirm={doReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}

      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t("home")}</span> / <span>{t("products")}</span> /{" "}
        <span className="text-gray-800 font-medium">اضافة تعديل كميات</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Plus size={20} className="text-primary" /> اضافة تعديل كميات
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة * إجبارية.
        </p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t("date")} *
            </label>
            <input
              type="text"
              value={formData.date}
              className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-gray-50 text-black"
              readOnly
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            {t("products")} *
          </label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="الرجاء إضافة الأصناف"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm text-right pr-10 bg-white text-black"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-10 mt-1 rounded-md overflow-y-auto max-h-60">
                {inventoryLoading ? (
                  <div className="p-3 text-center text-sm text-gray-500">جاري التحميل...</div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddItem(product)}
                      className="w-full p-3 text-right hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0 text-black"
                    >
                      {product.productName} - {product.productId}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">لا توجد نتائج</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-right text-black border-collapse">
            <thead className="bg-[#2ecc71] text-white">
              <tr>
                <th className="p-3 w-12 text-center">حذف</th>
                <th className="p-3">اسم الصنف</th>
                <th className="p-3 text-center">كود الصنف</th>
                <th className="p-3 text-center">الكمية المتاحة</th>
                <th className="p-3 text-center">نوع العملية</th>
                <th className="p-3 text-center">الكمية</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {formData.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    لا توجد أصناف مضافة
                  </td>
                </tr>
              ) : (
                formData.items.map((item) => (
                  <tr
                    key={item.stockInventoryId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.stockInventoryId)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                    <td className="p-3 font-bold">{item.productName}</td>
                    <td className="p-3 text-center font-medium">{item.productId ?? "-"}</td>
                    <td className="p-3 text-center font-medium">{item.quantityAvailable}</td>
                    <td className="p-3 text-center">
                      <select
                        value={item.operationType}
                        onChange={(e) =>
                          handleItemChange(item.stockInventoryId, "operationType", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value="Remove">طرح</option>
                        <option value="Add">إضافة</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantityChanged}
                        onChange={(e) =>
                          handleItemChange(item.stockInventoryId, "quantityChanged", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-center font-bold"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">{t("note")}</label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b p-2 flex gap-2 text-gray-700">
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><List size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
              <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
            </div>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full p-3 h-24 outline-none text-right bg-white"
            />
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleComplete}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {createMutation.isPending ? "جاري الحفظ..." : "حفظ البيانات"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
          >
            <RotateCcw size={20} /> إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
}