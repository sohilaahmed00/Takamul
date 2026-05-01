import { InvoiceData } from "@/components/pos/orders/printInvoice";
import { Customer } from "@/features/customers/types/customers.types";
import { Purchase } from "@/features/purchases/types/purchase.types";
import { SalesOrder } from "@/features/sales/types/sales.types";
import { Supplier } from "@/features/suppliers/types/suppliers.types";
import { createContext } from "react";

export type PrintType = "invoice" | "stock" | "claim" | "roll" | "quotation" | "purchase";
export type PrintableData = SalesOrder | Purchase | InvoiceData;

export interface PrintContextType {
  printInvoice: (data: PrintableData, type?: PrintType) => Promise<void>;
  printRoll: (data: InvoiceData) => Promise<void>;
  exportPDF: (data: InvoiceData) => Promise<void>;
  exportExcel: (data: InvoiceData) => Promise<void>;
  exportCSV: (data: InvoiceData) => Promise<void>;
}

export const PrintContext = createContext<PrintContextType>({} as PrintContextType);
