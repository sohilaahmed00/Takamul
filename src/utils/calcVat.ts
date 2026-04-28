export function calcVat(price: number, taxRate: number, taxCalculation: string | number) {
  const calc = Number(taxCalculation);
  if (calc === 1) return 0;
  if (calc === 2) return price - price / (1 + taxRate); // شامل
  return price * taxRate; // غير شامل
}
