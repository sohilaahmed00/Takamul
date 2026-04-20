export function calcVat(beforeTax: number, taxRate: number, taxCalculation: string | number) {
  const calc = Number(taxCalculation);
  if (calc === 1) return 0;
  return beforeTax * (taxRate / 100);
}

