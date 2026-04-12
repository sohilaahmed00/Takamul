export interface TopSellingProduct {
  productId: number;
  productName: string;
  barcode: string;
  sellingPrice: number;
  totalQuantitySold: number;
  totalSales: number;
}

export interface TopSellingParams {
  from?: string;
  to?: string;
}

export interface ProductMovement {
  productId: number;
  productNameAr: string;
  barcode: string;
  transDate: string;
  transType: string;
  qtyIn: number;
  qtyOut: number;
  invoiceNo: number;
  runningBalance: number;
}

export interface ProductMovementParams {
  productId: number | string;
  from?: string;
  to?: string;
}
