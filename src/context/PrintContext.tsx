import React, { createContext, useContext, ReactNode } from 'react';
import { 
  printVoucher, 
  getStockReceiptHTML, 
  getClaimReceiptHTML 
} from '@/utils/customExportUtils';
import { getAllCustomers } from '@/features/customers/services/customers';
import { useLanguage } from './LanguageContext';

interface PrintContextType {
  printInvoice: (data: any, type?: 'invoice' | 'stock' | 'claim') => Promise<void>;
}

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();

  const printInvoice = async (data: any, type: 'invoice' | 'stock' | 'claim' = 'invoice') => {
    if (!data?.id) return;

    // محاولة جلب رقم الجوال لو مش موجود
    const rawName = (data.customerName || data.customer || "").toString().trim();
    if (!data.customerPhone && rawName) {
      try {
        // جلب العميل مباشرة من الـ API بالاسم
        const response = await getAllCustomers({ page: 1, limit: 10, searchTerm: rawName });
        const customers = response?.items || [];
        
        const normalize = (str: string) => {
          if (!str) return "";
          return str
            .replace(/[أإآا]/g, "ا")
            .replace(/[ىي]/g, "ي")
            .replace(/[ةه]/g, "ه")
            .replace(/\s+/g, "")
            .replace(/[\u064B-\u0652]/g, "")
            .toLowerCase();
        };

        const searchTerm = normalize(rawName);
        const found = customers.find(c => {
          const cName = normalize(c.customerName || "");
          return cName === searchTerm || cName.includes(searchTerm) || searchTerm.includes(cName);
        });

        if (found) {
          data.customerPhone = found.mobile || found.phone || "";
        } else if (searchTerm.includes("افتراضي") || searchTerm.includes("نقدي") || searchTerm.includes("عام")) {
          data.customerPhone = "056225332";
        }
      } catch (err) {
        console.error("Error fetching customer for print:", err);
      }
    }

    let html = '';
    switch (type) {
      case 'stock':
        html = getStockReceiptHTML(data, t);
        printVoucher(html);
        break;
      case 'claim':
        html = getClaimReceiptHTML(data, t);
        printVoucher(html);
        break;
      case 'invoice':
      default:
        window.open(`/sales/invoice/${data.id}`, '_blank');
        break;
    }
  };

  return (
    <PrintContext.Provider value={{ printInvoice }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => useContext(PrintContext);