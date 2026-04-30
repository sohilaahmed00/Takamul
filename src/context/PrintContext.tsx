// PrintContext.tsx

import React, { useContext, ReactNode, useCallback } from "react";
import { printVoucher, getClaimReceiptHTML } from "@/utils/customExportUtils";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "@/hooks/useBranch";
import { getStockReceiptHTML } from "@/print/stockReceiptHTML";
import { getAllSuppliers, getSupplierById } from "@/features/suppliers/services/suppliers";
import { getAllProducts } from "@/features/products/services/products";
import { getCustomerById, getAllCustomers } from "@/features/customers/services/customers";

import { getA4InvoiceHTML } from "@/print/A4InvoiceTemplate";
import { getA4PrintHTML } from "@/print/GenericA4Template";
import { exportCustomPDF, exportToExcel, exportToCSV } from "@/utils/customExportUtils";
import { printInvoice as thermalPrint } from "@/components/pos/orders/printInvoice";
import { apiClient } from "@/api/client";
import { itemBasePrice, calcItemTax, calcTotals, CartItem } from "@/constants/data";

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
    // 1. Branch Info (Fast)
    let currentBranch = branchInfo;
    if (!currentBranch) {
      try {
        const response = await apiClient.get("/Branch/Employeebranch");
        currentBranch = response.data?.data || response.data;
      } catch (err) { /* silent */ }
    }

    const extendedData: InvoiceData = {
      ...data,
      branchInfo: currentBranch ?? null,
    };

    // If we already have customerData, don't do anything else
    if (extendedData.customerData) return extendedData;

    // 2. Identify Party (Customer or Supplier)
    const rawName = data.customerName || data.name || data.customer || data.supplierName || "";
    const searchTerm = normalize(rawName);

    // Try fetching by ID first (Most reliable)
    const cId = data.customerId || data.customerID || data.customer_id;
    const sId = data.supplierId || data.supplierID || data.supplier_id;

    if (cId) {
      try {
        const customer = await getCustomerById(Number(cId));
        if (customer) {
          extendedData.customerData = customer;
          extendedData.customerPhone = customer.mobile || customer.phone || "";
          return extendedData;
        }
      } catch (e) { console.error("Customer ID fetch failed", e); }
    }

    if (sId) {
      try {
        const supplier = await getSupplierById(Number(sId));
        if (supplier) {
          extendedData.customerData = supplier;
          extendedData.customerPhone = supplier.mobile || supplier.phone || "";
          return extendedData;
        }
      } catch (e) { console.error("Supplier ID fetch failed", e); }
    }

    // Fallback: Search by Name
    if (searchTerm) {
      // Search Customers
      try {
        const cResponse = await getAllCustomers({ page: 1, limit: 10, searchTerm: rawName });
        const foundC = cResponse?.items?.find((c: any) => normalize(c.customerName || "") === searchTerm || normalize(c.customerName || "").includes(searchTerm));
        if (foundC) {
          extendedData.customerData = foundC;
          extendedData.customerPhone = foundC.mobile || foundC.phone || "";
          return extendedData;
        }
      } catch (e) { /* ignore */ }

      // Search Suppliers
      try {
        const sResponse = await getAllSuppliers();
        const suppliers = (sResponse as any)?.items || sResponse || [];
        const foundS = suppliers.find((s: any) => normalize(s.supplierName || "") === searchTerm || normalize(s.supplierName || "").includes(searchTerm));
        if (foundS) {
          (extendedData as any).customerData = foundS;
          extendedData.customerPhone = foundS.mobile || foundS.phone || "";
        }
      } catch (e) { /* ignore */ }
    }

    return extendedData;
  }, [branchInfo]);

  const printRoll = useCallback(async (data: InvoiceData) => {
    const extendedData = await prepareExtendedData(data);
    const branch = extendedData.branchInfo || {};
    const rawItems = (extendedData.items || extendedData.orderItems || []) as any[];

    // Map raw items to CartItem format for calculation helpers
    const cart: CartItem[] = rawItems.map((item) => {
      const pct = Number(item?.discountPercentage ?? 0);
      const flat = Number(item?.discountValue ?? 0);
      const itemDiscount: CartItem["itemDiscount"] = pct > 0 ? { type: "pct", value: pct } : flat > 0 ? { type: "flat", value: flat } : null;

      return {
        productId: item.productId ?? 0,
        name: item.productName || item.name || "-",
        price: item.taxCalculation === 2 ? (item.unitPrice || item.price) : (item.priceBeforeTax ?? item.unitPrice ?? item.price ?? 0),
        qty: item.quantity ?? 1,
        taxamount: item.taxPercentage ?? item.taxamount ?? 15,
        taxCalculation: item.taxCalculation ?? 2,
        itemDiscount,
        note: "",
        op: null,
      };
    });

    const discVal = Number(extendedData.discountAmount || extendedData.discountValue || 0);
    const discount = discVal > 0 ? { type: "flat" as const, value: discVal } : { type: "pct" as const, value: 0 };

    const totals = calcTotals(cart, discount);

    const thermalData = {
      logoUrl: branch.imageUrl || "",
      invoiceNumber: (extendedData.purchaseOrderNumber || extendedData.orderNumber || extendedData.invoiceNo || extendedData.id || "").toString(),
      institutionName: branch.name || "",
      institutionNameEn: branch.nameEn || "",
      institutionTaxNumber: branch.taxNumber || "",
      institutionCommercialRegister: branch.commercialRegister || "",
      invoiceDate: extendedData.createdAt 
        ? new Date(extendedData.createdAt).toLocaleString("en-GB") 
        : (extendedData.orderDate || extendedData.date 
            ? new Date((extendedData.orderDate || extendedData.date) as any).toLocaleString("en-GB") 
            : new Date().toLocaleString("en-GB")),
      institutionAddress: [
        branch.cityName || branch.city || "",   // المنطقة (CityId)
        branch.stateName || branch.state || "", // المدينة (StateId)
        branch.district || "",                  // الحي
        branch.street || ""                     // الشارع
      ].filter(Boolean).join(" / ") || "",
      institutionPhone: branch.phone || "",
      customerName: extendedData.supplierName || extendedData.customerName || extendedData.customer || "",
      customerPhone: extendedData.customerPhone || "",
      customerAddress: [
        (extendedData as any).customerData?.cityName || "",
        (extendedData as any).customerData?.stateName || "",
        (extendedData as any).customerData?.district || "",
        (extendedData as any).customerData?.street || (extendedData as any).customerData?.address || ""
      ].filter(Boolean).join(" / ") || "",
      items: rawItems.map((item, index) => {
        // Use API values directly if available to ensure consistency
        const qty = Number(item.quantity ?? 1);
        const itemTax = item.taxAmount !== undefined ? Number(item.taxAmount) : calcItemTax(cart[index]);
        const itemLineTotal = item.lineTotal !== undefined ? Number(item.lineTotal) : (Number(item.subTotal || 0) + itemTax);
        
        // For Roll (POS) we want the 'Sub Total' column to show the line subtotal (total before tax)
        const lineSubTotal = itemLineTotal - itemTax;

        return {
          productName: item.productName || item.name || "-",
          quantity: qty,
          unitPrice: lineSubTotal, // This maps to "Sub Total" in the roll template
          taxAmount: Number(itemTax.toFixed(2)),
          total: Number(itemLineTotal.toFixed(2)) // Changed from lineTotal to total
        };
      }),
      subTotal: Number((extendedData.subTotal !== undefined ? extendedData.subTotal : totals.sub).toFixed(2)),
      discountAmount: Number((extendedData.discountAmount !== undefined ? extendedData.discountAmount : totals.discountAmount).toFixed(2)),
      taxAmount: Number((extendedData.taxAmount !== undefined ? extendedData.taxAmount : totals.tax).toFixed(2)),
      grandTotal: Number((extendedData.grandTotal !== undefined ? extendedData.grandTotal : totals.total).toFixed(2)),
      notes: extendedData.notes || (extendedData as any).orderNotes || (extendedData as any).note || (extendedData as any).description || "",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent((extendedData.orderNumber || extendedData.invoiceNo || extendedData.id || "").toString())}`,
    };

    await thermalPrint(thermalData as any);
  }, [prepareExtendedData]);

  const printInvoice = useCallback(
    async (data: InvoiceData, type: PrintType = "invoice") => {
      if (!data?.id) return;

      if (type === "roll") {
        return printRoll(data);
      }

      const extendedData = await prepareExtendedData(data);

      // Enrich items with names if missing (common in Purchases)
      const rawItems = (extendedData.items || extendedData.orderItems || extendedData.quotationItems || extendedData.purchaseItems || []) as any[];
      if (rawItems.length > 0 && rawItems.some(item => !item.productName && !item.name)) {
        try {
          const productsResponse = await getAllProducts(1, 1000);
          const products = productsResponse?.items || [];
          rawItems.forEach(item => {
            if (!item.productName && !item.name && item.productId) {
              const p = products.find((prod: any) => prod.id === item.productId);
              if (p) {
                item.productName = (p as any).productNameAr || (p as any).name || (p as any).productName;
                item.unitName = item.unitName || (p as any).baseUnitName || (p as any).unitName;
              }
            }
          });
        } catch (e) { console.error("Enrichment failed", e); }
      }

      const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      const htmlGetters: Record<string, () => string> = {
        invoice: () => getA4InvoiceHTML(extendedData, t, apiBase),
        stock: () => getStockReceiptHTML(extendedData, t),
        claim: () => getClaimReceiptHTML(extendedData, t),
        quotation: () => getA4PrintHTML(extendedData, "quotation", t, apiBase),
        purchase: () => getA4PrintHTML(extendedData, "purchase", t, apiBase),
      };

      const html = (htmlGetters[type] || htmlGetters["invoice"])();
      printVoucher(html);
    },
    [prepareExtendedData, t, printRoll],
  );

  const exportPDF = useCallback(async (data: InvoiceData) => {
    const extendedData = await prepareExtendedData(data);
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    const html = getA4InvoiceHTML(extendedData, t, apiBase);
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
    <PrintContext.Provider value={{ printInvoice, printRoll, exportPDF, exportExcel, exportCSV }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => useContext(PrintContext);