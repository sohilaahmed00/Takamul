import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  Edit2, 
  Trash2,
  Plus
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrencies, Currency } from '@/context/CurrenciesContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AddCurrencyModal from '@/components/AddCurrencyModal';

export default function Currencies() {
  const { t, direction } = useLanguage();
  const { currencies, deleteCurrency } = useCurrencies();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [currencyToDelete, setCurrencyToDelete] = useState<number | null>(null);

  const filteredCurrencies = currencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.includes(searchTerm)
  );

  const paginatedCurrencies = filteredCurrencies.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleAddClick = () => {
    setEditingCurrency(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 space-y-4" dir={direction}>
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <Coins size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('currencies')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('customize_report_below')}
          </p>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={currencyToDelete !== null}
        onClose={() => setCurrencyToDelete(null)}
        onConfirm={() => {
          if (currencyToDelete !== null) {
            deleteCurrency(currencyToDelete);
            setCurrencyToDelete(null);
          }
        }}
        itemName={currencies.find(c => c.id === currencyToDelete)?.name}
      />

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 space-y-4">
          {/* Table Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64 order-2 md:order-1">
              <input
                type="text"
                placeholder={t('search_placeholder') || "اكتب ما تريد ان تبحث عنه"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 outline-none focus:border-primary text-sm",
                  direction === 'rtl' ? "pr-10" : "pl-10"
                )}
              />
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 text-gray-400",
                direction === 'rtl' ? "right-3" : "left-3"
              )} size={18} />
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-2 order-1 md:order-2">
              <button 
                onClick={handleAddClick}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-sm"
              >
                <Plus size={18} />
                {t('add_currency')}
              </button>
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className={cn(
              "w-full border-collapse",
              direction === 'rtl' ? "text-right" : "text-left"
            )}>
              <thead>
                <tr className="bg-[var(--table-header)] text-white">
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t('currency_code')}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t('currency_name')}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t('exchange_rate')}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10">{t('symbol')}</th>
                  <th className="p-3 font-bold text-sm border-r border-white/10 text-center">{t('actions')}</th>
                  <th className="p-3 w-10 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedCurrencies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                ) : (
                  paginatedCurrencies.map((currency) => (
                    <tr key={`desktop-${currency.id}`} className="hover:bg-primary/5 transition-colors border-b border-gray-100 dark:border-gray-700">
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 font-bold text-sm">{currency.code}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm">{currency.name}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-sm">{currency.exchangeRate}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 font-bold text-sm">{currency.symbol}</td>
                      <td className="p-3 border-r border-gray-100 dark:border-gray-700 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(currency)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30"
                            title={t('edit')}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setCurrencyToDelete(currency.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900/30"
                            title={t('delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <input type="checkbox" className="w-4 h-4 accent-primary" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedCurrencies.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                {t('no_data_in_table')}
              </div>
            ) : (
              paginatedCurrencies.map((currency) => (
                <MobileDataCard
                  key={`mobile-${currency.id}`}
                  title={currency.name}
                  fields={[
                    { label: t('currency_code'), value: currency.code },
                    { label: t('exchange_rate'), value: currency.exchangeRate },
                    { label: t('symbol'), value: currency.symbol },
                  ]}
                  actions={
                    <div className="flex flex-wrap justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(currency)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Edit2 size={16} />
                        {t('edit')}
                      </button>
                      <button 
                        onClick={() => setCurrencyToDelete(currency.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Trash2 size={16} />
                        {t('delete')}
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>

          {/* Pagination Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>{t('showing')}</span>
              <span className="font-bold text-gray-900 dark:text-white">1</span>
              <span>{t('to')}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredCurrencies.length}</span>
              <span>{t('of')}</span>
              <span className="font-bold text-gray-900 dark:text-white">{filteredCurrencies.length}</span>
              <span>{t('records')}</span>
            </div>

            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                {t('previous')}
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                1
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                {t('next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddCurrencyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={editingCurrency}
      />
    </div>
  );
}
