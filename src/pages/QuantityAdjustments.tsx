import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useGetQuantityAdjustments } from "@/features/quantity-adjustments/hooks/useGetQuantityAdjustments";

// ─── Helper: get display name for performedBy ─────────────────────────────────
function getPerformedByName(performedBy?: string): string {
  if (!performedBy) return "-";

  // Try to get current user info from loginResponse in localStorage
  try {
    const stored = localStorage.getItem("loginResponse");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Extract username from nested response shapes
      const username =
        parsed?.username ||
        parsed?.userName ||
        parsed?.name ||
        parsed?.data?.username ||
        parsed?.data?.userName ||
        parsed?.data?.name ||
        parsed?.data?.data?.username ||
        parsed?.data?.data?.userName ||
        null;

      // Extract user id/sub to compare
      const userId =
        parsed?.userId ||
        parsed?.id ||
        parsed?.sub ||
        parsed?.data?.userId ||
        parsed?.data?.id ||
        parsed?.data?.sub ||
        null;

      if (userId && String(userId).toLowerCase() === performedBy.toLowerCase()) {
        return username || performedBy;
      }

      // Also try matching by username directly
      if (username && username.toLowerCase() === performedBy.toLowerCase()) {
        return username;
      }
    }
  } catch {
    // ignore parse errors
  }

  // Try to decode from JWT token
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const jwtUsername = payload?.username || payload?.name || payload?.preferred_username || null;
      const jwtSub = payload?.sub || null;

      if (jwtSub && jwtSub.toLowerCase() === performedBy.toLowerCase()) {
        return jwtUsername || performedBy;
      }
      if (jwtUsername && jwtUsername.toLowerCase() === performedBy.toLowerCase()) {
        return jwtUsername;
      }
    }
  } catch {
    // ignore
  }

  // If it looks like a UUID, try to shorten it — but just return as-is (backend issue)
  // Check if it's a plain username (not UUID format)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(performedBy);
  if (!isUUID) return performedBy;

  // UUID we can't resolve — return as-is, don't guess wrong user
  return performedBy;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuantityAdjustments() {
  const { direction } = useLanguage();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetQuantityAdjustments({
    pageNumber: page,
    pageSize: itemsPerPage,
  });

  const adjustments = data?.data ?? [];

  const filteredAdjustments = useMemo(() => {
    if (!searchTerm.trim()) return adjustments;
    return adjustments.filter((adj) =>
      `${adj.notes ?? ""} ${adj.performedBy ?? ""} ${adj.operationDate ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [adjustments, searchTerm]);

  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? (Math.ceil(totalCount / itemsPerPage) || 1);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-GB").replace(",", "");
  };

  return (
    <div className="space-y-4" dir={direction}>
      <div className="takamol-page-header">
        <div className={direction === "rtl" ? "text-right" : "text-left"}>
          <h1 className="takamol-page-title flex items-center gap-2">
            <FileText size={24} className="text-[var(--primary)]" />
            <span>تعديلات الكمية</span>
          </h1>
          <p className="takamol-page-subtitle">إدارة وتتبع مذكرات تسوية المخزون</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/products/quantity-adjustments/create")}
            className="btn-primary"
          >
            <Plus size={20} /> إضافة تعديل كمية
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 min-w-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="بحث بالتاريخ أو مدخل البيانات أو المذكرة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="takamol-input !py-2"
            />
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-gray-400",
                direction === "rtl" ? "left-3" : "right-3"
              )}
              size={18}
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 w-full md:w-auto justify-end">
            <span>اظهر</span>
            <select
              className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] px-3 py-1.5 outline-none cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={() => refetch()}
              className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-1.5"
            >
              تحديث
            </button>
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden md:block overflow-visible pb-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="takamol-table mb-0">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>مدخل البيانات</th>
                  <th>مذكرة</th>
                  <th className="w-40 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">جاري التحميل...</td></tr>
                ) : isError ? (
                  <tr><td colSpan={4} className="text-center py-8 text-red-500 font-bold">فشل تحميل البيانات</td></tr>
                ) : filteredAdjustments.length > 0 ? (
                  filteredAdjustments.map((adj) => (
                    <tr key={adj.id}>
                      <td className="text-gray-800 font-bold whitespace-nowrap">{formatDate(adj.operationDate)}</td>
                      <td className="text-gray-600 font-medium">{getPerformedByName(adj.performedBy)}</td>
                      <td className="text-gray-600">{adj.notes || "-"}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/products/quantity-adjustments/view/${adj.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">عرض</button>
                          <button onClick={() => navigate(`/products/quantity-adjustments/edit/${adj.id}`)} className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm">تعديل</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500 font-bold">لا توجد سجلات، قم بإضافة تعديل جديد.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500 font-bold">جاري التحميل...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500 font-bold">فشل تحميل البيانات</div>
          ) : filteredAdjustments.length > 0 ? (
            filteredAdjustments.map((adj) => (
              <div key={adj.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-400 font-medium">التاريخ</span>
                  <span className="text-sm font-bold text-gray-800">{formatDate(adj.operationDate)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                  <span className="text-xs text-gray-400 font-medium">مدخل البيانات</span>
                  <span className="text-sm font-medium text-gray-600 truncate max-w-[180px]">{getPerformedByName(adj.performedBy)}</span>
                </div>
                {adj.notes && (
                  <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                    <span className="text-xs text-gray-400 font-medium">مذكرة</span>
                    <span className="text-sm text-gray-600">{adj.notes}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => navigate(`/products/quantity-adjustments/view/${adj.id}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-bold transition-colors">عرض</button>
                  <button onClick={() => navigate(`/products/quantity-adjustments/edit/${adj.id}`)} className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white py-2 rounded-lg text-sm font-bold transition-colors">تعديل</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 font-bold">لا توجد سجلات، قم بإضافة تعديل جديد.</div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 pt-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 hover:bg-gray-50 border-l border-gray-200 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" /> التالي
            </button>

            <button className="px-4 py-2 bg-[#2ecc71] text-white font-bold text-sm border-l border-gray-200">
              {page}
            </button>

            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 hover:bg-gray-50 text-gray-600 flex items-center gap-1 font-bold text-sm transition-colors disabled:opacity-50"
            >
              سابق <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm font-bold text-gray-500">
            إجمالي السجلات: {totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}