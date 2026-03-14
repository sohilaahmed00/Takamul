import { PurchaseStatus, PaymentStatus, type Purchase } from "@/types";

export const initialPurchases: Purchase[] = [
  {
    id: "1",
    date: "2024-03-24",
    reference: "PO-2024-001",
    supplier: "شركة التوريدات العالمية",
    status: PurchaseStatus.RECEIVED,
    total: 1500.0,
    paid: 1500.0,
    balance: 0.0,
    paymentStatus: PaymentStatus.PAID,
  },
  {
    id: "2",
    date: "2024-03-23",
    reference: "PO-2024-002",
    supplier: "مؤسسة النور للتجارة",
    status: PurchaseStatus.PENDING,
    total: 2850.5,
    paid: 1000.0,
    balance: 1850.5,
    paymentStatus: PaymentStatus.PARTIAL,
  },
  {
    id: "3",
    date: "2024-03-22",
    reference: "PO-2024-003",
    supplier: "مصنع الأمل للبلاستيك",
    status: PurchaseStatus.ORDERED,
    total: 5400.0,
    paid: 0.0,
    balance: 5400.0,
    paymentStatus: PaymentStatus.DUE,
  },
];
