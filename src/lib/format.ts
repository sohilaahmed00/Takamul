import type { SystemSettings } from "@/context/SettingsContext";
import type { Settings as StoreSettings } from "@/features/settings/store/settingsStore";

export function formatCurrency(amount: number, settings: StoreSettings | SystemSettings | any): string {
  const money = settings?.money || {};
  let decimalSeparator = money.decimalSeparator || '.';
  let thousandSeparator = money.thousandSeparator || ',';
  let decimals = money.decimals ?? 2;
  
  // Map descriptive separators to actual characters
  if (decimalSeparator.includes('Dot')) decimalSeparator = '.';
  if (thousandSeparator === 'فاصلة' || thousandSeparator === 'Comma') thousandSeparator = ',';
  
  // Fix to the specified number of decimals
  let fixedAmount = Number(amount || 0).toFixed(decimals);
  
  // Split into integer and decimal parts
  let [integerPart, decimalPart] = fixedAmount.split('.');
  
  // Add thousand separators to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Combine with decimal separator
  const formatted = decimalPart ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart;
  
  return settings.money.showCurrencySymbol 
    ? `${formatted} ${settings.money.currencySymbol}`
    : formatted;
}
