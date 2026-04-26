import { FormValues } from "../types/products.types";

export { createProductSchema } from "./direct.schema";
export type { DirectProductFormValues } from "./direct.schema";

export { createBranchedProductSchema } from "./branched.schema";
export type { BranchedProductFormValues } from "./branched.schema";

export { createPreparedProductSchema } from "./prepared.schema";
export type { PreparedProductFormValues } from "./prepared.schema";

export { createRawMaterialSchema } from "./rawMaterial.schema";
export type { RawMaterialFormValues } from "./rawMaterial.schema";


export const baseDefaultValues: FormValues = {
  Barcode: "",
  ProductNameAr: "",
  ProductNameEn: "",
  ProductNameUr: "",
  Description: "",
  CategoryId: 0,
  CostPrice: undefined,
  SellingPrice: undefined,
  MinStockLevel: undefined,
  TaxId: 0,
  TaxCalculation: 0,
  Image: undefined,
  ChildrenIds: [],
  RawMaterials: [{ rawMaterialId: 0, quantity: undefined as unknown as number, unitId: 0 }],
  BaseUnitId: undefined,
  PurchaseUnitId: 0,
  ConversionFactor: undefined,
};
