import React, { createContext, useContext, ReactNode } from 'react';
import { 
  printVoucher, 
  getStockReceiptHTML, 
  getClaimReceiptHTML 
} from '@/utils/customExportUtils';
import { useLanguage } from './LanguageContext';

interface PrintContextType {
  printInvoice: (data: any, type?: 'invoice' | 'stock' | 'claim') => void;
}

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();

  const printInvoice = (data: any, type: 'invoice' | 'stock' | 'claim' = 'invoice') => {
    if (!data?.id) return;

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
        // للفواتير العادية بنقدر نستخدم نفس الطريقة لو عندنا Template
        // أو نفضل على الطريقة القديمة لو لسه مجهزناش الـ HTML بتاعها
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