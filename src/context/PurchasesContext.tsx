import React, { createContext, useContext, useState, useEffect } from "react";
import { PurchaseStatus, PaymentStatus, type Purchase } from "@/types";

interface PurchasesContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, "id">) => void;
  updatePurchase: (id: string, updates: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

const initialPurchases: Purchase[] = [
  {
    id: "1",
    date: "2024-03-24",
    reference: "PO-2024-001",
    supplier: "شركة التوريدات العالمية",
    status: PurchaseStatus.RECEIVED,
    total: 1500.0,
    paid: 1500.0,
    balance: 0.0,
    paymentStatus: PaymentStatus.PAID,
  },
  {
    id: "2",
    date: "2024-03-23",
    reference: "PO-2024-002",
    supplier: "مؤسسة النور للتجارة",
    status: PurchaseStatus.PENDING,
    total: 2850.5,
    paid: 1000.0,
    balance: 1850.5,
    paymentStatus: PaymentStatus.PARTIAL,
  },
  {
    id: "3",
    date: "2024-03-22",
    reference: "PO-2024-003",
    supplier: "مصنع الأمل للبلاستيك",
    status: PurchaseStatus.ORDERED,
    total: 5400.0,
    paid: 0.0,
    balance: 5400.0,
    paymentStatus: PaymentStatus.DUE,
  },
];

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem("takamul_purchases");
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  useEffect(() => {
    localStorage.setItem("takamul_purchases", JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (purchase: Omit<Purchase, "id">) => {
    const newPurchase = { ...purchase, id: Date.now().toString() };
    setPurchases([newPurchase, ...purchases]);
  };

  const updatePurchase = (id: string, updates: Partial<Purchase>) => {
    setPurchases(purchases.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePurchase = (id: string) => {
    setPurchases(purchases.filter((p) => p.id !== id));
  };

  return <PurchasesContext.Provider value={{ purchases, addPurchase, updatePurchase, deletePurchase }}>{children}</PurchasesContext.Provider>;
};

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (context === undefined) {
    throw new Error("usePurchases must be used within a PurchasesProvider");
  }
  return context;
};
