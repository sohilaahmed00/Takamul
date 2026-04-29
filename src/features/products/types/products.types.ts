import type { PaginationMeta } from "@/types";
import { BranchedProductFormValues, DirectProductFormValues, PreparedProductFormValues, RawMaterialFormValues } from "../schemas";

export type ProductType = "Direct" | "Branched" | "Prepared" | "RawMatrial";

export type FormValues = DirectProductFormValues & BranchedProductFormValues & PreparedProductFormValues & RawMaterialFormValues;

export type Product = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  categoryName: string;
  barcode: string;
  minStockLevel: number;
  description: string | null;
  sellingPrice: number;
  costPrice: number;
  taxCalculation: number;
  isActive: boolean;
  imageUrl: string;
  parentProductId: number;
  categoryId: number;
  productType: "Direct" | "Prepared" | "Branched" | "RawMatrial";
  taxAmount: number;
  taxId: number;
  priceBeforeTax: number;
  priceAfterTax: number;
  balance: number;
  baseUnitId: number;
  unitId: number;
  taxPercentage: number;
};
export type ProductDirect = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  categoryId: number;
  barcode: string;
  description: string | null;
  categoryName: string;
  costPrice: number;
  sellingPrice: number;
  priceBeforeTax: number;
  priceAfterTax: number;
  minStockLevel: number;
  imageUrl: string;
  taxName: string;
  baseUnitId: number;
  taxAmount: number;
  taxId: number;
  taxCalculation: number;
  isActive: boolean;
};
export type ProductBranch = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  description: string | null;
  categoryName: string;
  categoryId: number;
  imageUrl: string | null;
  isActive: boolean;
  children: {
    id: number;
    productCode: number;
    productNameAr: string;
    barcode: string;
    costPrice: number;
    sellingPrice: number;
  }[];
};

export type ProductRawMatrial = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  description: string;
  categoryName: string | null;
  costPrice: number;
  baseUnitId: number;
  baseUnitName: string;
  purchaseUnitId: number;
  purchaseUnitName: string;
  conversionFactor: number;
  minStockLevel: number;
  isActive: boolean;
};
export type ProductPrepared = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  barcode: string;
  description: string;
  categoryName: string;
  costPrice: number;
  sellingPrice: number;
  priceBeforeTax: number;
  priceAfterTax: number;
  categoryId: number;
  taxId: number;
  taxAmount: number;
  taxName: string | null;
  taxCalculation: number;
  isActive: boolean;
  baseUnitId: number;
  components: {
    componentProductId: number;
    componentNameAr: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    unitId: number;
  }[];
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
  ProductType?: "Direct" | "Prepared" | "Branched" | "RawMatrial";
}

export interface GetAllProductsResponse extends PaginationMeta {
  items: Product[];
}
export interface GetAllProductDirectResponse extends PaginationMeta {
  items: ProductDirect[];
}
export interface GetAllProductBranchedResponse extends PaginationMeta {
  items: ProductBranch[];
}
export interface GetAllProductPreparedResponse extends PaginationMeta {
  items: ProductPrepared[];
}
export interface GetAllProductRawMatrialResponse extends PaginationMeta {
  items: ProductRawMatrial[];
}
