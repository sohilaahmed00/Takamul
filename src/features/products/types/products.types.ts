export type Product = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  categoryName: string;
  categoryId: number;
  barcode: string;
  minStockLevel: number;
  description: string | null;
  sellingPrice: number;
  costPrice: number;
  taxCalculation: string;
  isActive: boolean;
  imageUrl: string;
  parentProductId: number;
  productType: "Direct" | "Prepared" | "Branched" | "RawMatrial";
};
export type ProductDirect = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  barcode: string;
  description: string | null;
  categoryName: string;
  costPrice: number;
  sellingPrice: number;
  priceBeforeTax: number;
  minStockLevel: number;
  imageUrl: string;
  taxName: string;
  taxAmount: number;
  taxCalculation: "Excludestax" | "Includestax" | string;
  isActive: boolean;
};
export type ProductRawMatrial = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  barcode: string;
  description: string | null;
  categoryName: string;
  minStockLevel: number;
  baseUnitName: string;
  purchaseUnitName: string;
  conversionFactor: number;
  isActive: boolean;
};
export interface CreateProduct {
  barcode?: string;
  productNameAr: string;
  productNameEn?: string;
  productNameUr?: string;
  description?: string;
  categoryName: string;
  costPrice: number;
  sellingPrice: number;
  minStockLevel?: number;
  taxId?: number;
  taxCalculation: string;
  image?: File | string;
  //in Update Product
  ProductType?: "Direct" | "Prepared" | "Branched" | "RawMatrial";
}

export type GetAllProductsResponse = {
  items: Product[];
};
export type GetAllProductDirectResponse = ProductDirect[];
export type GetAllProductRawMatrialResponse = ProductRawMatrial[];
