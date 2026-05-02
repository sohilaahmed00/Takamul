export interface Tax {
  id: number;
  name: string;
  amount: number;
}

export interface CreateTax {
  name: string;
  amount: number;
}

export type UpdateTax = CreateTax;

export type GetAllTaxesResponse = Tax[];
