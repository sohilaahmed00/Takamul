// ─── NAVIGATION ──────────────────────────────────────────────────────────────
import { Home, Users, LayoutGrid, DollarSign, ClipboardList, BarChart2, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "tables", icon: LayoutGrid, label: "Tables" },
  { id: "orders", icon: ClipboardList, label: "Orders" },
  //   { id: "reports", icon: BarChart2, label: "Reports" },
  //   { id: "settings", icon: Settings, label: "Settings" },
];

// ─── MENU DATA ────────────────────────────────────────────────────────────────

export const TABLES_LIST = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "T-07", "T-08"];
export const DELIVERY_COMPANIES = ["Talabat", "Careem", "Noon Food", "Deliveroo"];

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type OrderType = "takeaway" | "dine-in" | "delivery";
export type NetworkSpeed = "slow" | "medium" | "fast";
export type Screen = "home" | "customers" | "tables" | "cashier" | "orders" | "reports" | "settings" | "success" | "hold-list";

export interface CartExtra {
  name: string;
  id: number;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  note: string;
  taxamount: number;
  op?: number | null;
  itemDiscount?: { type: "pct" | "flat"; value: number } | null;
  taxCalculation: number;
  extras?: CartExtra[];
}

export interface HeldCart {
  note: string;
  items: CartItem[];
  total: number;
  time: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function itemBasePrice(item: CartItem): number {
  const base = item.price * item.qty;
  const rate = (item.taxamount ?? 0) / 100;

  // استخرج السعر قبل الضريبة أولاً
  const baseBeforeTax = item.taxCalculation === 2 ? base / (1 + rate) : base;

  // طبّق الخصم على السعر قبل الضريبة
  if (item.itemDiscount) {
    const disc = item.itemDiscount.type === "pct" ? baseBeforeTax * (item.itemDiscount.value / 100) : item.itemDiscount.value;
    return Math.max(0, baseBeforeTax - disc);
  }

  return baseBeforeTax;
}
export function calcItemTax(item: CartItem): number {
  const rate = (item.taxamount ?? 0) / 100;

  if (!item.taxCalculation || item.taxCalculation === 1) return 0;

  // الضريبة تتحسب على السعر قبلها بعد الخصم
  const basePrice = itemBasePrice(item);

  if (item.taxCalculation === 2 || item.taxCalculation === 3) {
    return basePrice * rate;
  }

  return 0;
}

export function itemTotal(item: CartItem): number {
  return itemBasePrice(item) + calcItemTax(item);
}

export function calcTotals(cart: CartItem[], discount: number) {
  const sub = cart.reduce((s, item) => s + itemBasePrice(item), 0);
  const originalTax = cart.reduce((s, item) => s + calcItemTax(item), 0);

  const subAfterDiscount = Math.max(0, sub - discount);

  // نسبة الخصم من الـ subtotal
  const discountRatio = sub > 0 ? discount / sub : 0;

  // كل item يتطبق عليه الخصم بنفس النسبة، والضريبة تتحسب على سعره بعد الخصم
  const tax = parseFloat(
    cart.reduce((s, item) => {
      const rate = (item.taxamount ?? 0) / 100;
      const itemBase = itemBasePrice(item);
      const itemBaseAfterDiscount = itemBase * (1 - discountRatio);
      return s + itemBaseAfterDiscount * rate;
    }, 0).toFixed(2)
  );

  const total = parseFloat((subAfterDiscount + tax).toFixed(2));

  return { sub, tax, total, originalTax };
}