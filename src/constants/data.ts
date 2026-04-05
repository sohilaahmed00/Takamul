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
export const MENU_DATA = [
  {
    name: "بطاطس",
    price: 0,
    cat: "Starters",
    e: "🍟",
    children: [
      { name: "بطاطس فرايز صغير", price: 10 },
      { name: "بطاطس فرايز وسط", price: 15 },
      { name: "بطاطس فرايز كبير", price: 20 },
    ],
  },
  { name: "Schezwan Egg Noodles", price: 24, cat: "Lunch", e: "🍜" },
  { name: "Stir Egg Fry Udon Noodles", price: 24, cat: "Lunch", e: "🍝" },
  { name: "Thai Style Fried Noodles", price: 24, cat: "Lunch", e: "🍛" },
  { name: "Chinese Prawn Spaghetti", price: 24, cat: "Lunch", e: "🦐" },
  { name: "Japanese Soba Noodles", price: 24, cat: "Lunch", e: "🍱" },
  { name: "Chilli Garlic Thai Noodles", price: 24, cat: "Lunch", e: "🌶️" },
  { name: "Thai Style Fried Noodles", price: 24, cat: "Starters", e: "🍢" },
  { name: "Schezwan Egg Noodles", price: 24, cat: "Starters", e: "🥘" },
  { name: "Spring Rolls", price: 12, cat: "Starters", e: "🌯" },
  { name: "Stir Egg Fry Udon", price: 24, cat: "Breakfast", e: "🍳" },
  { name: "Chilli Garlic Thai", price: 24, cat: "Breakfast", e: "🥗" },
  { name: "Lemon Dessert", price: 18, cat: "Deserts", e: "🍋" },
  { name: "Ice Cream Sundae", price: 14, cat: "Deserts", e: "🍨" },
  { name: "Fresh Juice", price: 8, cat: "Beverages", e: "🥤" },
  { name: "Iced Coffee", price: 10, cat: "Beverages", e: "☕" },
  { name: "Grilled Chicken", price: 28, cat: "Supper", e: "🍗" },
  { name: "BBQ Ribs", price: 32, cat: "Supper", e: "🥩" },
];

export const CATS = [
  { id: "Starters", label: "Starters", children: ["Cold Starters", "Hot Starters"] },
  { id: "Breakfast", label: "Breakfast", children: [] },
  { id: "Lunch", label: "Lunch", children: ["Fast Lunch", "Full Meal"] },
  { id: "Supper", label: "Supper", children: [] },
  { id: "Deserts", label: "Deserts", children: [] },
  { id: "Beverages", label: "Beverages", children: ["Hot", "Cold"] },
];

export const SAMPLE_CUSTOMERS = [
  { name: "Benjamin Cole", email: "ben.cole@gmail.com", date: "16/11/2024" },
  { name: "Monica Bill", email: "m.bill@gmail.com", date: "16/11/2024" },
  { name: "Tyler Cox", email: "tyler.cox@gmail.com", date: "16/11/2024" },
  { name: "Janary Foi", email: "jan.foi@gmail.com", date: "19/12/2024" },
];

export const INITIAL_CART = [
  { name: "Schezwan Egg Noodles", price: 25, qty: 1, note: "", op: null },
  { name: "Spicy Shrimp Soup", price: 40, qty: 2, note: "Medium- Half Grilled", op: 50 },
  { name: "Thai Style Fried Noodles", price: 40, qty: 2, note: "Medium", op: 50 },
  { name: "Fried Basil", price: 75, qty: 3, note: "" },
];

export const TABLES_LIST = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06", "T-07", "T-08"];
export const DELIVERY_COMPANIES = ["Talabat", "Careem", "Noon Food", "Deliveroo"];

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type OrderType = "takeaway" | "dine-in" | "delivery";
export type NetworkSpeed = "slow" | "medium" | "fast";
export type Screen = "home" | "customers" | "tables" | "cashier" | "orders" | "reports" | "settings" | "success" | "hold-list";

export interface CartExtra {
  name: string;
  price: number;
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
export function itemTotal(item: CartItem): number {
  const extrasSum = (item.extras ?? []).reduce((s, e) => s + e.price, 0);
  const base = (item.price + extrasSum) * item.qty;
  const tax = calcItemTax(item);

  const total = item.taxCalculation === 3 ? base + tax : base;

  if (!item.itemDiscount) return total;
  const disc = item.itemDiscount.type === "pct" ? total * (item.itemDiscount.value / 100) : item.itemDiscount.value;
  return Math.max(0, total - disc);
}

// في constants/data.ts
export function calcItemTax(item: CartItem): number {
  const base = item.price * item.qty;
  const rate = (item.taxamount ?? 0) / 100;

  if (!item.taxCalculation || item.taxCalculation === 1) return 0;

  if (item.taxCalculation === 2) {
    // السعر شامل الضريبة → الضريبة = السعر - (السعر / (1 + rate))
    return base - base / (1 + rate);
  }

  if (item.taxCalculation === 3) {
    // السعر غير شامل الضريبة → الضريبة = السعر × rate
    return base * rate;
  }

  return 0;
}
export function calcTotals(cart: CartItem[], discount: number) {
  const sub = cart?.reduce((s, i) => s + itemTotal(i), 0);
  const tax = cart?.reduce((s, i) => s + calcItemTax(i), 0);

  return {
    sub,
    tax,
    total: parseFloat((sub - discount).toFixed(2)),
  };
}
