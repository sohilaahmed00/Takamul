import React, { createContext, useContext, ReactNode } from 'react';
import {
  printVoucher,
  getStockReceiptHTML,
  getClaimReceiptHTML
} from '@/utils/customExportUtils';
import { getAllCustomers, getCustomerById } from '@/features/customers/services/customers';
import { useLanguage } from './LanguageContext';

interface PrintContextType {
  printInvoice: (data: any, type?: 'invoice' | 'stock' | 'claim') => Promise<void>;
}

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

import { useBranch } from '@/hooks/useBranch';

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const { data: branchInfo } = useBranch();

  const printInvoice = async (data: any, type: 'invoice' | 'stock' | 'claim' = 'invoice') => {
    if (!data?.id) return;

    const clean = (obj: any) => {
      if (!obj) return obj;
      const newObj = { ...obj };
      Object.keys(newObj).forEach((key) => {
        if (newObj[key] === "string" || newObj[key] === "null" || newObj[key] === "undefined") {
          newObj[key] = null;
        }
      });
      return newObj;
    };

    const cleanedBranchInfo = clean(branchInfo);
    const cleanedData = clean(data);

    const extendedData = {
      ...cleanedData,
      branchInfo: cleanedBranchInfo || cleanedData.branchInfo || null
    };

    const rawName = (data.customerName || data.customer || "").toString().trim();
    const customerId = data.customerId;

    if (!extendedData.customerPhone) {
      try {
        let foundCustomer = null;

        if (customerId) {
          // جلب العميل بالمعرف (أكثر دقة)
          const response = await getCustomerById(customerId);
          // الرد قد يكون مباشر أو داخل كائن data
          foundCustomer = (response as any).data || response;
        } else if (rawName) {
          // محاولة البحث بالاسم كخيار احتياطي
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
          foundCustomer = customers.find(c => {
            const cName = normalize(c.customerName || "");
            return cName === searchTerm || cName.includes(searchTerm) || searchTerm.includes(cName);
          });
        }

        if (foundCustomer) {
          const phoneVal = foundCustomer.mobile || foundCustomer.phone || "";
          extendedData.customerPhone = phoneVal;
          extendedData.mobile = phoneVal;
          extendedData.phone = phoneVal;
        } else if (rawName && (rawName.includes("افتراضي") || rawName.includes("نقدي") || rawName.includes("عام"))) {
          const defaultPhone = "056225332";
          extendedData.customerPhone = defaultPhone;
          extendedData.mobile = defaultPhone;
          extendedData.phone = defaultPhone;
        }
      } catch (err) {
        console.error("Error fetching customer for print:", err);
      }
    }

    let html = '';
    switch (type) {
      case 'stock':
        html = getStockReceiptHTML(extendedData, t);
        printVoucher(html);
        break;
      case 'claim':
        html = getClaimReceiptHTML(extendedData, t);
        printVoucher(html);
        break;
      case 'invoice':
      default:
        window.open(`/sales/invoice/${extendedData.id}`, '_blank');
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