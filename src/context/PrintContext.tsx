import React, { useContext, ReactNode, useCallback } from "react";
import { printVoucher, getClaimReceiptHTML, exportCustomPDF, exportToExcel, exportToCSV } from "@/utils/customExportUtils";
import { useLanguage } from "./LanguageContext";
import { getStockReceiptHTML } from "@/print/stockReceiptHTML";
import { getAllSuppliers, getSupplierById } from "@/features/suppliers/services/suppliers";
import { getAllProducts } from "@/features/products/services/products";
import { getCustomerById } from "@/features/customers/services/customers";
import { getA4InvoiceHTML } from "@/print/A4InvoiceTemplate";
import { getA4PrintHTML } from "@/print/GenericA4Template";
import { InvoiceData, printInvoice as thermalPrint } from "@/components/pos/orders/printInvoice";
import { calcItemTax, calcTotals, CartItem } from "@/constants/data";
import { PrintContext, PrintType } from "./PrintContextDefinitions";
import { BranchInfo, useBranch } from "@/features/EmployeeBranches/hooks/useBranch";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { Purchase } from "@/features/purchases/types/purchase.types";
import { Customer } from "@/features/customers/types/customers.types";
import { Supplier } from "@/features/suppliers/types/suppliers.types";

const toNum = (v: any, fallback = 0): number => Number(v ?? fallback);

const joinAddress = (...parts: (string | undefined | null)[]): string => parts.filter(Boolean).join(" / ");

const buildInvoiceDateStr = (data: any): string => {
  const raw = data.createdAt || data.orderDate || data.date;
  return raw ? new Date(raw).toLocaleString("en-GB") : new Date().toLocaleString("en-GB");
};

type PrintableData = SalesOrder | Purchase | InvoiceData;

type RawItem = {
  productId?: number;
  productName?: string;
  name?: string;
  price?: number;
  unitPrice?: number;
  priceBeforeTax?: number;
  quantity?: number;
  taxamount?: number;
  taxPercentage?: number;
  taxCalculation?: number;
  taxAmount?: number;
  discountPercentage?: number;
  discountValue?: number;
  subTotal?: number;
  lineTotal?: number;
};

type ExtendedData = SalesOrder &
  Purchase & {
    branchInfo: BranchInfo;
    customer?: Customer;
    supplier?: Supplier;
    note?: string;
    description?: string;
  };
export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const { data: branchInfo } = useBranch();
  const prepareExtendedData = useCallback(
    async (data: PrintableData): Promise<ExtendedData> => {
      const ext: ExtendedData = { ...(data as any), branchInfo: branchInfo! };
      if (ext.customer || ext.supplier) return ext;
      const cId = (data as SalesOrder).customerId;
      const sId = (data as Purchase).supplierId;

      if (cId) {
        try {
          const customer = await getCustomerById(Number(cId));
          if (customer) {
            ext.customer = customer;
            return ext;
          }
        } catch {}
      }

      if (sId) {
        try {
          const supplier = await getSupplierById(Number(sId));
          if (supplier) {
            ext.supplier = supplier;
            return ext;
          }
        } catch {}
      }

      return ext;
    },
    [branchInfo],
  );

  const buildThermalData = useCallback((ext: ExtendedData, branch: BranchInfo): InvoiceData => {
    const rawItems: RawItem[] = ext.items ?? [];
    const cart: CartItem[] = rawItems.map((item) => {
      const pct = Number(item.discountPercentage);
      const flat = Number(item.discountValue);
      return {
        productId: item.productId ?? 0,
        name: item.productName || item.name || "-",
        price: item.taxCalculation === 2 ? item.unitPrice || item.price || 0 : (item.priceBeforeTax ?? item.unitPrice ?? item.price ?? 0),
        qty: Number(item.quantity) || 1,
        taxamount: item.taxamount ?? 0,
        taxPercentage: item.taxPercentage ?? 0,
        taxCalculation: item.taxCalculation ?? 2,
        itemDiscount: pct > 0 ? { type: "pct", value: pct } : flat > 0 ? { type: "flat", value: flat } : null,
        note: "",
      };
    });

    const discVal = Number(ext.discountAmount);
    const discount = discVal > 0 ? { type: "flat" as const, value: discVal } : { type: "pct" as const, value: 0 };
    const totals = calcTotals(cart, discount);

    return {
      logoUrl: branch.imageUrl || "",
      invoiceNumber: String(ext.orderNumber),
      institutionName: branch.name || "",
      institutionNameEn: branch.nameEn || "",
      institutionTaxNumber: branch.taxNumber || "",
      institutionCommercialRegister: branch.commercialRegister || "",
      invoiceDate: buildInvoiceDateStr(ext),
      institutionAddress: joinAddress(branch.cityName, branch.stateName, branch.district, branch.street),
      institutionPhone: branch.phone || "",
      customer: ext.customer!,
      supplier: ext.supplier!,
      items: rawItems.map((item, i) => {
        const itemTax = item.taxAmount !== undefined ? Number(item.taxAmount) : calcItemTax(cart[i]);
        const lineTotal = item.lineTotal !== undefined ? Number(item.lineTotal) : Number(item.subTotal) + itemTax;
        return {
          productName: item.productName || item.name || "-",
          quantity: Number(item.quantity) || 0,
          unitPrice: Number((lineTotal - itemTax).toFixed(2)),
          taxAmount: Number(itemTax.toFixed(2)),
          total: Number(lineTotal.toFixed(2)),
        };
      }),
      subTotal: Number((ext.subTotal ?? totals.sub).toFixed(2)),
      discountAmount: Number((ext.discountAmount ?? totals.discountAmount).toFixed(2)),
      taxAmount: Number((ext.taxAmount ?? totals.tax).toFixed(2)),
      grandTotal: Number((ext.grandTotal ?? totals.total).toFixed(2)),
      notes: ext.notes || ext.note || ext.description || "",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(String(ext.orderNumber || ext.purchaseOrderNumber || ext.id || ""))}`,
    };
  }, []);

  const printRoll = useCallback(
    async (data: PrintableData) => {
      const ext = await prepareExtendedData(data);
      const branch = ext.branchInfo;
      await thermalPrint(buildThermalData(ext, branch));
    },
    [prepareExtendedData, buildThermalData],
  );

  const printInvoice = useCallback(
    async (data: PrintableData, type: PrintType = "invoice") => {
      if (!data?.id) return;
      if (type === "roll") return printRoll(data);
      const ext = await prepareExtendedData(data);
      const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

      const htmlGetters: Record<string, () => string> = {
        invoice: () => getA4InvoiceHTML(ext, t, apiBase),
        stock: () => getStockReceiptHTML(ext, t),
        claim: () => getClaimReceiptHTML(ext, t),
        quotation: () => getA4PrintHTML(ext, "quotation", t, apiBase),
        purchase: () => getA4PrintHTML(ext, "purchase", t, apiBase),
      };

      printVoucher((htmlGetters[type] ?? htmlGetters["invoice"])());
    },
    [prepareExtendedData, printRoll, t],
  );

  const exportPDF = useCallback(
    async (data: PrintableData) => {
      const ext = await prepareExtendedData(data);
      const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      await exportCustomPDF(`Invoice_${(ext as any).invoiceNo || (ext as any).orderNumber || (ext as any).id}`, getA4InvoiceHTML(ext, t, apiBase));
    },
    [prepareExtendedData, t],
  );

  const exportExcel = useCallback(
    async (data: PrintableData) => {
      const ext = await prepareExtendedData(data);
      const items = ((ext as any).items || (ext as any).orderItems || []) as any[];
      exportToExcel(
        items.map((item: any) => ({
          name: item.productName || item.name,
          unit: item.unitName || "قطعة",
          quantity: item.quantity,
          price: item.price || item.unitPrice,
          tax: (toNum(item.price || item.unitPrice) * toNum(item.quantity, 1) * 0.15).toFixed(2),
          total: (toNum(item.price || item.unitPrice) * toNum(item.quantity, 1) * 1.15).toFixed(2),
        })),
        [
          { header: "بيان الصنف", field: "name" },
          { header: "الوحدة", field: "unit" },
          { header: "الكمية", field: "quantity" },
          { header: "السعر", field: "price" },
          { header: "الضريبة", field: "tax" },
          { header: "الاجمالي", field: "total" },
        ],
        `Invoice_${(ext as any).invoiceNo || (ext as any).orderNumber || (ext as any).id}`,
      );
    },
    [prepareExtendedData],
  );

  const exportCSV = useCallback(
    async (data: PrintableData) => {
      const ext = await prepareExtendedData(data);
      const items = ((ext as any).items || (ext as any).orderItems || []) as any[];
      exportToCSV(
        items.map((item: any) => ({
          "Item Description": item.productName || item.name,
          Unit: item.unitName || "قطعة",
          Quantity: item.quantity,
          Price: item.price || item.unitPrice,
          Total: (toNum(item.price || item.unitPrice) * toNum(item.quantity, 1) * 1.15).toFixed(2),
        })),
        `Invoice_${(ext as any).invoiceNo || (ext as any).orderNumber || (ext as any).id}`,
      );
    },
    [prepareExtendedData],
  );

  return <PrintContext.Provider value={{ printInvoice, printRoll, exportPDF, exportExcel, exportCSV }}>{children}</PrintContext.Provider>;
};

export const usePrint = () => useContext(PrintContext);
