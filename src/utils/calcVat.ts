export function calcVat(price: number, taxRate: number, taxCalculation: string | number) {
  const calc = Number(taxCalculation);
  if (calc === 1) return 0;
  if (calc === 2) return price - price / (1 + taxRate); // شامل - بدون /100
  return price * taxRate; // غير شامل - بدون /100
}
