import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Delegate } from "../types";

interface DelegatesContextType {
  delegates: Delegate[];
  addDelegate: (delegate: Omit<Delegate, "id">) => void;
  updateDelegate: (delegate: Delegate) => void;
  deleteDelegate: (id: string) => void;
}

const DelegatesContext = createContext<DelegatesContextType | undefined>(undefined);

export const DelegatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [delegates, setDelegates] = useState<Delegate[]>([
    { id: "1", code: "345345", name: "35xcvsdf", phone: "0103055555", region: "عام" },
    { id: "2", code: "0001", name: "عام", phone: "0", region: "عام" },
  ]);

  const addDelegate = (delegate: Omit<Delegate, "id">) => {
    const newDelegate = {
      ...delegate,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDelegates([...delegates, newDelegate]);
  };

  const updateDelegate = (updatedDelegate: Delegate) => {
    setDelegates(delegates.map((d) => (d.id === updatedDelegate.id ? updatedDelegate : d)));
  };

  const deleteDelegate = (id: string) => {
    setDelegates(delegates.filter((d) => d.id !== id));
  };

  return <DelegatesContext.Provider value={{ delegates, addDelegate, updateDelegate, deleteDelegate }}>{children}</DelegatesContext.Provider>;
};

export const useDelegates = () => {
  const context = useContext(DelegatesContext);
  if (context === undefined) {
    throw new Error("useDelegates must be used within a DelegatesProvider");
  }
  return context;
};
