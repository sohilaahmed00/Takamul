import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DeliveryCompany } from '../types';

interface DeliveryCompaniesContextType {
  deliveryCompanies: DeliveryCompany[];
  addDeliveryCompany: (company: Omit<DeliveryCompany, 'id'>) => void;
  updateDeliveryCompany: (company: DeliveryCompany) => void;
  deleteDeliveryCompany: (id: string) => void;
}

const DeliveryCompaniesContext = createContext<DeliveryCompaniesContextType | undefined>(undefined);

export const DeliveryCompaniesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deliveryCompanies, setDeliveryCompanies] = useState<DeliveryCompany[]>([
    { id: '1', name: 'جاهز' },
    { id: '2', name: 'كيتا' },
    { id: '3', name: 'هنجر' },
  ]);

  const addDeliveryCompany = (company: Omit<DeliveryCompany, 'id'>) => {
    const newCompany = { ...company, id: Math.random().toString(36).substr(2, 9) };
    setDeliveryCompanies([...deliveryCompanies, newCompany]);
  };

  const updateDeliveryCompany = (company: DeliveryCompany) => {
    setDeliveryCompanies(deliveryCompanies.map(c => c.id === company.id ? company : c));
  };

  const deleteDeliveryCompany = (id: string) => {
    setDeliveryCompanies(deliveryCompanies.filter(c => c.id !== id));
  };

  return (
    <DeliveryCompaniesContext.Provider value={{
      deliveryCompanies,
      addDeliveryCompany,
      updateDeliveryCompany,
      deleteDeliveryCompany
    }}>
      {children}
    </DeliveryCompaniesContext.Provider>
  );
};

export const useDeliveryCompanies = () => {
  const context = useContext(DeliveryCompaniesContext);
  if (context === undefined) {
    throw new Error('useDeliveryCompanies must be used within a DeliveryCompaniesProvider');
  }
  return context;
};
