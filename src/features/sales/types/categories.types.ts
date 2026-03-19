
export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  warehouseName: string;
  orderDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: "UnConfirmed" | "Confirmed";
}
export type CreateCategory = {
  CategoryNameAr: string;
  CategoryNameEn: string;
  CategoryNameUr: string;
  description: string;
  ParentCategoryId: number;
};

export type GetAllSalesOrderResponse = SalesOrder[];
