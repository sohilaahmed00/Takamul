// src/components/ui/CustomPagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalRecords: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function CustomPagination({
  currentPage,
  totalRecords,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 20, 50],
  onPageChange,
  onRowsPerPageChange,
}: CustomPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));
  const from = Math.min((currentPage - 1) * rowsPerPage + 1, totalRecords);
  const to = Math.min(currentPage * rowsPerPage, totalRecords);
  const pageRange = getPageRange(currentPage, totalPages);

  return (
    <div className="cpag-root">
      {/* ── Left: rows per page + count ── */}
      <div className="cpag-left">
        <span className="cpag-label">عرض</span>
        <select
          className="cpag-select"
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          {rowsPerPageOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="cpag-label">من أصل {totalRecords}</span>
      </div>

      {/* ── Right: page buttons ── */}
      <div className="cpag-buttons">
        {/* Prev */}
        <button
          className={cn("cpag-btn cpag-btn-arrow", currentPage === 1 && "cpag-btn-disabled")}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={14} />
        </button>

        {pageRange.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="cpag-dots">···</span>
          ) : (
            <button
              key={p}
              className={cn("cpag-btn", currentPage === p && "cpag-btn-active")}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={cn("cpag-btn cpag-btn-arrow", currentPage === totalPages && "cpag-btn-disabled")}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
}
