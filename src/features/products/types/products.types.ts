import type { PaginationMeta } from "@/types";

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
  taxCalculation: number;
  isActive: boolean;
  imageUrl: string;
  parentProductId: number;
  parentCategoryId: number;
  productType: "Direct" | "Prepared" | "Branched" | "RawMatrial";
  taxAmount: number;
  taxId: number;
  priceBeforeTax: number;
  balance: number;
};
export type ProductDirect = {
  id: number;
  productCode: number;
  productNameAr: string;
  productNameEn: string;
  productNameUr: string;
  parentCategoryId: number;
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
  taxId: number;
  taxCalculation: "Excludestax" | "Includestax" | string;
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
  parentCategoryId: number;
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
  description: string | null;
  baseUnitName: string;
  purchaseUnitName: string;
  conversionFactor: number;
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
  parentCategoryId: number;
  sellingPrice: number;
  priceBeforeTax: number;
  taxAmount: number;
  taxName: string | null;
  taxCalculation: number;
  isActive: boolean;
  components: {
    componentProductId: number;
    componentNameAr: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
  minStockLevel: number;
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
