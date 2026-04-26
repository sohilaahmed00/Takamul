// PrintContext.tsx

import React, { useContext, ReactNode, useCallback } from "react";
import { printVoucher, getClaimReceiptHTML } from "@/utils/customExportUtils";
import { getAllCustomers } from "@/features/customers/services/customers";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "@/hooks/useBranch";
import { getStockReceiptHTML } from "@/print/stockReceiptHTML";

import { getA4InvoiceHTML } from "@/print/A4InvoiceTemplate";
import { exportCustomPDF, exportToExcel, exportToCSV } from "@/utils/customExportUtils";

import { PrintContext, PrintContextType, PrintType, InvoiceData } from "./PrintContextDefinitions";

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

  const prepareExtendedData = useCallback(async (data: InvoiceData) => {
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
    return extendedData;
  }, [branchInfo]);

  const printInvoice = useCallback(
    async (data: InvoiceData, type: PrintType = "invoice") => {
      if (!data?.id) return;
      const extendedData = await prepareExtendedData(data);

      const htmlGetters: Record<PrintType, () => string> = {
        invoice: () => getA4InvoiceHTML(extendedData, t),
        stock: () => getStockReceiptHTML(extendedData, t),
        claim: () => getClaimReceiptHTML(extendedData, t),
      };

      const html = htmlGetters[type]();
      printVoucher(html);
    },
    [prepareExtendedData, t],
  );

  const exportPDF = useCallback(async (data: InvoiceData) => {
    const extendedData = await prepareExtendedData(data);
    const html = getA4InvoiceHTML(extendedData, t);
    await exportCustomPDF(`Invoice_${extendedData.invoiceNo || extendedData.orderNumber || extendedData.id}`, html);
  }, [prepareExtendedData, t]);

  const exportExcel = useCallback(async (data: InvoiceData) => {
    const extendedData = await prepareExtendedData(data);
    const items = (extendedData.items || extendedData.orderItems || []) as any[];
    const columns = [
      { header: "بيان الصنف", field: "name" },
      { header: "الوحدة", field: "unit" },
      { header: "الكمية", field: "quantity" },
      { header: "السعر", field: "price" },
      { header: "الضريبة", field: "tax" },
      { header: "الاجمالي", field: "total" },
    ];
    const excelData = items.map(item => ({
      name: item.productName || item.name,
      unit: item.unitName || "قطعة",
      quantity: item.quantity,
      price: item.price || item.unitPrice,
      tax: (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 0) * 0.15).toFixed(2),
      total: (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 0) * 1.15).toFixed(2),
    }));
    exportToExcel(excelData, columns, `Invoice_${extendedData.invoiceNo || extendedData.orderNumber || extendedData.id}`);
  }, [prepareExtendedData]);

  const exportCSV = useCallback(async (data: InvoiceData) => {
    const extendedData = await prepareExtendedData(data);
    const items = (extendedData.items || extendedData.orderItems || []) as any[];
    const csvData = items.map(item => ({
      "Item Description": item.productName || item.name,
      "Unit": item.unitName || "قطعة",
      "Quantity": item.quantity,
      "Price": item.price || item.unitPrice,
      "Total": (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 0) * 1.15).toFixed(2),
    }));
    exportToCSV(csvData, `Invoice_${extendedData.invoiceNo || extendedData.orderNumber || extendedData.id}`);
  }, [prepareExtendedData]);

  return (
    <PrintContext.Provider value={{ printInvoice, exportPDF, exportExcel, exportCSV }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => useContext(PrintContext);
