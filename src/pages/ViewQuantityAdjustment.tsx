import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useGetQuantityAdjustmentDetails } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustmentDetails";
import { useGetStockInventory } from "@/features/quantity-adjustments/hooks/useGetStockInventory";

function formatOperationType(value: unknown) {
  if (value === "Remove") return "طرح";
  if (value === "Subtract") return "طرح";
  if (value === "Add") return "إضافة";
  if (value === 0) return "إضافة";
  return String(value ?? "-");
}

export default function ViewQuantityAdjustment() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const adjustmentId = Number(id);

  const { data, isLoading, isError } = useGetQuantityAdjustmentDetails(adjustmentId);

  // ✅ Load inventory to resolve productId from productName
  const { data: inventoryResponse } = useGetStockInventory({
    pageNumber: 1,
    pageSize: 500,
    search: "",
  });
  const inventoryOptions = inventoryResponse?.items ?? [];

  const rows = useMemo(() => {
    return (data?.items ?? []).map((item) => {
      const match = inventoryOptions.find(
        (inv) => inv.productName === item.productName
      );
      return {
        ...item,
        resolvedProductId: match?.productId ?? null,
      };
    });
  }, [data, inventoryOptions]);

  const formattedDate = data?.operationDate
    ? new Date(data.operationDate).toLocaleString("en-GB").replace(",", "")
    : "";

  if (isLoading) return <div className="p-6">جاري التحميل...</div>;
  if (isError || !data) return <div className="p-6 text-red-500">فشل تحميل بيانات التعديل</div>;

  return (
    <div className="space-y-4 text-black" dir={direction}>
      <div className="text-sm text-gray-500 flex items-center gap-1 font-medium px-2">
        <span>{t("home")}</span> / <span>{t("products")}</span> /{" "}
        <span className="text-gray-800">تفاصيل التعديل الكمي</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={20} className="text-primary" /> تفاصيل التعديل الكمي
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">عرض بيانات العملية</p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t("date")} *</label>
            <input
              type="text"
              value={formattedDate}
              className="takamol-input font-mono text-center bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-right text-black border-collapse">
            <thead className="bg-[#2ecc71] text-white">
              <tr>
                <th className="p-3">اسم الصنف</th>
                <th className="p-3 text-center">كود الصنف</th>
                <th className="p-3 text-center">الكمية المتاحة/الإجمالية</th>
                <th className="p-3 text-center">نوع</th>
                <th className="p-3 text-center">كمية</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 italic bg-gray-50 font-bold">
                    لا توجد أصناف
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={`${item.id ?? index}-${index}`} className="border-b border-gray-100">
                    <td className="p-3 font-bold">{item.productName ?? "-"}</td>
                    {/* ✅ Show resolved productId from inventory match */}
                    <td className="p-3 text-center font-medium">
                      {item.resolvedProductId ? item.resolvedProductId : "-"}
                    </td>
                    <td className="p-3 text-center">{item.quantity ?? "-"}</td>
                    <td className="p-3 text-center">{formatOperationType(item.operationType)}</td>
                    <td className="p-3 text-center">{item.quantityChanged ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">{t("note")}</label>
          <textarea
            value={data.notes ?? ""}
            className="w-full p-4 h-24 outline-none text-right bg-gray-50 border border-gray-300 rounded-lg resize-none"
            readOnly
          />
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate("/products/quantity-adjustments")}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-2.5 rounded-md font-bold hover:bg-gray-700 transition-colors shadow-sm text-[15px]"
          >
            <span>رجوع</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate(`/products/quantity-adjustments/edit/${adjustmentId}`)}
            className="flex items-center justify-center gap-2 bg-[#00a651] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#008f45] transition-colors shadow-sm text-[15px]"
          >
            <span>تعديل</span>
          </button>
        </div>
      </div>
    </div>
  );
}