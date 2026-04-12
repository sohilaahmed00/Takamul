import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrencies, type Currency } from "@/context/CurrenciesContext";
import ResponsiveModal from "./ResponsiveModal";

import { Input } from "@/components/ui/input";

interface AddCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency | null;
}

export default function AddCurrencyModal({ isOpen, onClose, currency }: AddCurrencyModalProps) {
  const { t, direction } = useLanguage();
  const { addCurrency, updateCurrency } = useCurrencies();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: "",
    autoUpdate: false,
  });

  useEffect(() => {
    if (currency) {
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        autoUpdate: currency.autoUpdate,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        symbol: "",
        exchangeRate: "",
        autoUpdate: false,
      });
    }
  }, [currency, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currency) {
      updateCurrency(currency.id, formData);
    } else {
      addCurrency(formData);
    }
    onClose();
  };

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={currency ? t("edit_currency") : t("add_currency")} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)] text-center">{t("please_enter_info_below")}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="takamol-label">{t("currency_code")} *</label>
            <Input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}  />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("currency_name")} *</label>
            <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}  />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("symbol")} *</label>
            <Input type="text" required value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}  />
          </div>

          <div className="space-y-2">
            <label className="takamol-label">{t("exchange_rate")} *</label>
            <Input type="text" required value={formData.exchangeRate} onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}  />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Input type="checkbox" id="autoUpdate" checked={formData.autoUpdate} onChange={(e) => setFormData({ ...formData, autoUpdate: e.target.checked })} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="autoUpdate" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">
              {t("auto_update")}
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <button type="submit" className="btn-primary w-full">
            {currency ? t("update") : t("add_currency")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
