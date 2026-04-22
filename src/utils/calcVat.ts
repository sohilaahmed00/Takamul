export function calcVat(beforeTax: number, taxRate: number, taxCalculation: string | number) {
  const calc = Number(taxCalculation);
  if (calc === 1) return 0;
  if (calc === 2) return beforeTax - beforeTax / (1 + taxRate / 100);
  return beforeTax * (taxRate / 100);
}
