import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PrintContextType {
    printInvoice: (data: any) => void;
    receiptData: any;
}

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
    const [receiptData, setReceiptData] = useState<any>(null);

    const printInvoice = (data: any) => {
        setReceiptData(data);
        setTimeout(() => {
            window.print();
            setReceiptData(null); // السطر ده مهم جداً عشان يرجع الموقع يطبع طبيعي بعد الفاتورة
        }, 300);
    };

    return (
        <PrintContext.Provider value={{ printInvoice, receiptData }}>
            {children}
        </PrintContext.Provider>
    );
};

export const usePrint = () => useContext(PrintContext);