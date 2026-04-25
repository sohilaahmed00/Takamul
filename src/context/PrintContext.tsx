// PrintContext.tsx

import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { printVoucher, getClaimReceiptHTML } from "@/utils/customExportUtils";
import { getAllCustomers } from "@/features/customers/services/customers";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "@/hooks/useBranch";
import { getStockReceiptHTML } from "@/print/stockReceiptHTML";

// ✅ Type محدد بدل any
interface InvoiceData {
  id: string | number;
  customerName?: string;
  customer?: string;
  customerPhone?: string;
  [key: string]: unknown;
}

interface PrintContextType {
  printInvoice: (data: InvoiceData, type?: PrintType) => Promise<void>;
}

type PrintType = "invoice" | "stock" | "claim";

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

// ✅ نقلنا normalize برا الـ component عشان مش محتاجة تتعمل كل render
const normalize = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/[أإآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/[ةه]/g, "ه")
    .replace(/\s+/g, "")
    .replace(/[\u064B-\u0652]/g, "")
    .toLowerCase();
};

const DEFAULT_CUSTOMER_PHONE = "056225332";
const CASH_CUSTOMER_KEYWORDS = ["افتراضي", "نقدي", "عام"];

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const { data: branchInfo } = useBranch();

  const printInvoice = useCallback(
    async (data: InvoiceData, type: PrintType = "invoice") => {
      if (!data?.id) return;

      const extendedData: InvoiceData = {
        ...data,
        branchInfo: branchInfo ?? null,
      };

      const rawName = (data.customerName ?? data.customer ?? "").toString().trim();
      if (!extendedData.customerPhone && rawName) {
        try {
          const response = await getAllCustomers({ page: 1, limit: 10, searchTerm: rawName });
          const customers = response?.items ?? [];
          const searchTerm = normalize(rawName);

          const found = customers.find((c) => {
            const cName = normalize(c.customerName ?? "");
            return cName === searchTerm || cName.includes(searchTerm) || searchTerm.includes(cName);
          });

          if (found) {
            extendedData.customerPhone = found.mobile ?? found.phone ?? "";
          } else if (CASH_CUSTOMER_KEYWORDS.some((kw) => searchTerm.includes(kw))) {
            extendedData.customerPhone = DEFAULT_CUSTOMER_PHONE;
          }
        } catch (err) {
          console.error("[PrintContext] Failed to fetch customer phone:", err);
        }
      }

      const htmlGetters: Record<Exclude<PrintType, "invoice">, () => string> = {
        stock: () => getStockReceiptHTML(extendedData, t),
        claim: () => getClaimReceiptHTML(extendedData, t),
      };

      if (type === "invoice") {
        window.open(`/sales/invoice/${extendedData.id}`, "_blank");
      } else {
        const html = htmlGetters[type]();
        printVoucher(html);
      }
    },
    [branchInfo, t],
  );

  return <PrintContext.Provider value={{ printInvoice }}>{children}</PrintContext.Provider>;
};

export const usePrint = () => useContext(PrintContext);