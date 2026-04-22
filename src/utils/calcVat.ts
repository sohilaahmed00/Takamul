export function calcVat(finalPrice: number, taxRate: number, taxCalculation: string | number) {
  const calc = Number(taxCalculation);
  if (calc === 1) return 0;
  if (calc === 2) return finalPrice - finalPrice / (1 + taxRate / 100);
  if (calc === 3) return finalPrice - finalPrice / (1 + taxRate / 100);
  return 0;
}
