import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const { t, direction } = useLanguage();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfPagesToShow) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfPagesToShow) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - maxPagesToShow + 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4 text-sm pagination-container">
      <div className="text-[var(--text-muted)]">
        {t("showing_records")} {startItem} {t("to")} {endItem} {t("of")} {totalItems} {t("records")}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handlePrevious} disabled={currentPage === 1} className="px-3 py-1 border border-[var(--border)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-main)] flex items-center gap-1 text-[var(--text-main)] transition-colors">
          {direction === "rtl" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <span>{t("previous")}</span>
        </button>
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-[var(--text-muted)]">...</span>
              ) : (
                <button onClick={() => onPageChange(page as number)} className={`px-3 py-1 border rounded-md transition-colors ${currentPage === page ? "bg-[var(--primary)] text-white border-[var(--primary)] font-bold" : "border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-main)]"}`}>
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 border border-[var(--border)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--bg-main)] flex items-center gap-1 text-[var(--text-main)] transition-colors">
          <span>{t("next")}</span>
          {direction === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
