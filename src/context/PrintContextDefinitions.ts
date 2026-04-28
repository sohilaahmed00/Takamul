import { createContext } from "react";

export interface InvoiceData {
  id: string | number;
  customerName?: string;
  name?: string;
  customer?: string;
  supplierName?: string;
  customerPhone?: string;
  customerId?: string | number;
  customerID?: string | number;
  customer_id?: string | number;
  supplierId?: string | number;
  supplierID?: string | number;
  supplier_id?: string | number;
  branchInfo?: any;
  customerData?: any;
  items?: any[];
  orderItems?: any[];
  quotationItems?: any[];
  purchaseItems?: any[];
  invoiceNo?: string;
  orderNumber?: string;
  createdAt?: string | number | Date;
  orderDate?: string | number | Date;
  date?: string | number | Date;
  discountAmount?: number;
  discountValue?: number;
  subTotal?: number;
  taxAmount?: number;
  grandTotal?: number;
  notes?: string;
  orderNotes?: string;
  [key: string]: unknown;
}

export type PrintType = "invoice" | "stock" | "claim" | "roll" | "quotation" | "purchase";

export interface PrintContextType {
  printInvoice: (data: InvoiceData, type?: PrintType) => Promise<void>;
  printRoll: (data: InvoiceData) => Promise<void>;
  exportPDF: (data: InvoiceData) => Promise<void>;
  exportExcel: (data: InvoiceData) => Promise<void>;
  exportCSV: (data: InvoiceData) => Promise<void>;
}

export const PrintContext = createContext<PrintContextType>({} as PrintContextType);
