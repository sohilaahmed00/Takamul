import React, { createContext, useContext, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { Treasury } from '@/types';

interface TreasurysContextType {
    treasurys: Treasury[];
    addTreasury: (treasury: Omit<Treasury, 'id' | 'currentBalance'>) => void;
    updateTreasury: (id: number, treasury: Partial<Treasury>) => void;
    deleteTreasury: (id: number) => void;
}

const TreasurysContext = createContext<TreasurysContextType | undefined>(undefined);

export const TreasurysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useLanguage();
    const [treasurys, setTreasurys] = useState<Treasury[]>([
        {
            id: 1,
            name: t("treasury_default_name"),
            openingBalance: 0,
            currentBalance: 0
        }
    ]);

    const addTreasury = (newTreasury: Omit<Treasury, 'id' | 'currentBalance'>) => {
        const treasury: Treasury = {
            ...newTreasury,
            id: Date.now(),
            currentBalance: newTreasury.openingBalance
        };
        setTreasurys(prev => [...prev, treasury]);
    };

    const updateTreasury = (id: number, updatedTreasury: Partial<Treasury>) => {
        setTreasurys(prev => prev.map(treasury => treasury.id === id ? { ...treasury, ...updatedTreasury } : treasury));
    };

    const deleteTreasury = (id: number) => {
        setTreasurys(prev => prev.filter(treasury => treasury.id !== id));
    };

    return (
        <TreasurysContext.Provider value={{ treasurys, addTreasury, updateTreasury, deleteTreasury }}>
            {children}
        </TreasurysContext.Provider>
    );
};

export const useTreasurys = () => {
    const context = useContext(TreasurysContext);
    if (context === undefined) {
        throw new Error('useTreasurys must be used within a TreasurysProvider');
    }
    return context;
};
