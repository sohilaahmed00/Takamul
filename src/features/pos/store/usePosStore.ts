// ─── usePosStore.ts ───────────────────────────────────────────────────────────
import { create } from "zustand";
import { calcTotals, type CartItem, type Screen, type OrderType, type NetworkSpeed, itemBasePrice, calcItemTax, itemBasePriceRaw } from "@/constants/data";
import { Customer } from "@/features/customers/types/customers.types";
import { InvoiceData, printInvoice } from "@/components/pos/orders/printInvoice";
import { BonData, printPreparationBon } from "@/components/pos/orders/printPreparationBon";
import formatDate from "@/lib/formatDate";
import { CreateSalesOrder } from "@/features/sales/types/sales.types";
import { Product } from "@/features/products/types/products.types";

export type DineInMode = "new-order" | "add-items" | "checkout" | null;

export const INSTITUTION_NAME = "اسم المؤسسة";
export const INSTITUTION_TAX_NO = "310XXXXXXXXX";
export const INSTITUTION_ADDRESS = "عنوان المؤسسة";
export const INSTITUTION_PHONE = "05XXXXXXXX";
export const INSTITUTION_NOTES = "";
export const LOGO_URL: string | undefined = undefined;

export type AddToCartProduct = Pick<Product, "id" | "productNameAr" | "productNameEn" | "productNameUr" | "sellingPrice" | "taxAmount" | "taxCalculation" | "taxPercentage">;
interface PosState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  cart: CartItem[];
  setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  addToCart: (item: AddToCartProduct) => void;

  discount: { type: "pct" | "flat"; value: number };
  setDiscount: (d: { type: "pct" | "flat"; value: number }) => void;

  orderType: OrderType;
  setOrderType: (t: OrderType) => void;

  selectedTable: number | null;
  setSelectedTable: (t: number | null) => void;

  selectedDelivery: string | null;
  setSelectedDelivery: (d: string | null) => void;

  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;

  selectedGiftCardId: number | null;
  setSelectedGiftCardId: (g: number | null) => void;

  selectedVaultId: number | null;
  setSelectedVaultId: (id: number | null) => void;

  paidAmount: number;
  setPaidAmount: (a: number) => void;

  networkSpeed: NetworkSpeed;
  setNetworkSpeed: (s: NetworkSpeed) => void;

  dineInMode: DineInMode;
  setDineInMode: (m: DineInMode) => void;

  selectedOrderId: number | null;
  setSelectedOrderId: (id: number | null) => void;

  holdingOrderId: number | null;
  setHoldingOrderId: (id: number | null) => void;

  search: string;
  setSearch: (s: string) => void;

  selectedItemIdx: number | null;
  setSelectedItemIdx: (idx: number | null) => void;

  orderNote: string;
  setOrderNote: (note: string) => void;

  resetCart: (customers?: { items: Customer[] }) => void;

  handleReleaseHoldingOrder: (
    payments: CreateSalesOrder["payments"],
    deps: {
      releaseHolding: (p: any) => Promise<any>;
      customers?: { items: Customer[] };
    },
  ) => Promise<void>;

  handleCreateDineInOrder: (deps: { createDineInOrderyOrder: (p: any) => Promise<any> }) => Promise<void>;

  handleAddItemsToExistingOrder: (deps: { addItemsToOrder: (p: any) => Promise<any> }) => Promise<void>;

  handleConfirmPayment: (params: { printKitchenBon?: boolean; isHolding?: boolean; payments?: { amount: number; treasuryId: number; notes: string }[]; createTakwayOrder: (p: any) => Promise<any>; createDeliveryOrder: (p: any) => Promise<any>; checkoutDineInOrder: (p: any) => Promise<any>; releaseHolding: (p: any) => Promise<any>; customers?: { items: Customer[] } }) => Promise<void>;
}

export const usePosStore = create<PosState>((set, get) => ({
  screen: "home",
  setScreen: (screen) => set({ screen }),
  cart: [],
  setCart: (cart) =>
    set((state) => ({
      cart: typeof cart === "function" ? cart(state.cart) : cart,
    })),

  discount: { type: "pct", value: 0 },
  setDiscount: (discount) => set({ discount }),

  orderType: "TakeAway",
  setOrderType: (orderType) => set({ orderType }),

  selectedTable: null,
  setSelectedTable: (selectedTable) => set({ selectedTable }),

  selectedDelivery: null,
  setSelectedDelivery: (selectedDelivery) => set({ selectedDelivery }),

  selectedCustomer: null,
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),

  selectedGiftCardId: null,
  setSelectedGiftCardId: (selectedGiftCardId) => set({ selectedGiftCardId }),

  selectedVaultId: null,
  setSelectedVaultId: (selectedVaultId) => set({ selectedVaultId }),

  paidAmount: 0,
  setPaidAmount: (paidAmount) => set({ paidAmount }),

  networkSpeed: "fast",
  setNetworkSpeed: (networkSpeed) => set({ networkSpeed }),

  dineInMode: null,
  setDineInMode: (dineInMode) => set({ dineInMode }),

  selectedOrderId: null,
  setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),

  holdingOrderId: null,
  setHoldingOrderId: (holdingOrderId) => set({ holdingOrderId }),

  search: "",
  setSearch: (search) => set({ search }),

  selectedItemIdx: null,
  setSelectedItemIdx: (selectedItemIdx) => set({ selectedItemIdx }),

  orderNote: "",
  setOrderNote: (orderNote) => set({ orderNote }),

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((i) => i.productId === product.id);

      if (existing) {
        return {
          cart: state.cart.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i)),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            productId: product.id,
            name: product.productNameAr,
            productNameEn: product.productNameEn,
            productNameUr: product.productNameUr,
            price: product.sellingPrice,
            qty: 1,
            note: "",
            op: null,
            taxamount: product.taxAmount,
            taxCalculation: product.taxCalculation,
            itemDiscount: null,
            taxPercentage: product?.taxPercentage,
            extras: [],
          },
        ],
      };
    }),

  resetCart: (customers) => {
    set({
      cart: [],
      holdingOrderId: null,
      discount: { type: "pct", value: 0 },
      selectedGiftCardId: null,
      selectedVaultId: null,
      screen: "home",
      orderNote: "",
      selectedCustomer: customers?.items?.[0] ?? null,
    });
  },

  handleReleaseHoldingOrder: async (payments, { releaseHolding, customers }) => {
    const { holdingOrderId, resetCart, cart, selectedCustomer, discount } = get();
    if (!holdingOrderId) return;

    try {
      await releaseHolding({ id: holdingOrderId, data: payments });

      const hasItemDiscounts = cart.some((item) => item.itemDiscount && item.itemDiscount.value > 0);
      const totals = calcTotals(cart, hasItemDiscounts ? { type: "pct", value: 0 } : discount);
      const discountAmount = hasItemDiscounts
        ? cart.reduce((acc, item) => {
            const raw = itemBasePriceRaw(item);
            const afterDisc = itemBasePrice(item);
            return acc + (raw - afterDisc);
          }, 0)
        : totals.discountAmount;

      const invoiceData: InvoiceData = {
        logoUrl: LOGO_URL,
        invoiceNumber: `—`,
        institutionName: INSTITUTION_NAME,
        institutionTaxNumber: INSTITUTION_TAX_NO,
        invoiceDate: formatDate(new Date()),
        institutionAddress: INSTITUTION_ADDRESS,
        institutionPhone: INSTITUTION_PHONE,
        customerName: selectedCustomer?.customerName ?? undefined,
        customerPhone: undefined,
        items: cart.map((item) => {
          const base = itemBasePrice(item);
          const tax = calcItemTax(item);
          return {
            productName: item.name,
            quantity: item.qty,
            unitPrice: Number(base.toFixed(2)),
            taxAmount: Number(tax.toFixed(2)),
            total: Number((base + tax).toFixed(2)),
          };
        }),
        subTotal: Number(totals.sub.toFixed(2)),
        discountAmount: Number(discountAmount),
        taxAmount: totals.originalTax,
        grandTotal: totals.total,
        notes: INSTITUTION_NOTES,
      };

      await printInvoice(invoiceData);

      set({ selectedOrderId: null });
      resetCart(customers);
    } catch {}
  },

  handleCreateDineInOrder: async ({ createDineInOrderyOrder }) => {
    const { cart, selectedCustomer, discount, selectedGiftCardId, selectedTable, orderNote } = get();

    const payload = {
      customerId: selectedCustomer?.id,
      warehouseId: 1,
      notes: orderNote,
      globalDiscountValue: 0,
      globalDiscountPercentage: discount,
      giftCardId: selectedGiftCardId,
      additionIds: cart.flatMap((c) => (c.extras ?? []).map((e) => e.id!)).filter(Boolean),
      tableId: Number(selectedTable),
      items: cart.map((c) => ({
        productId: c.productId,
        quantity: c.qty,
        discountValue: c.itemDiscount?.type === "flat" ? c.itemDiscount.value : 0,
        discountPercentage: c.itemDiscount?.type === "pct" ? c.itemDiscount.value : 0,
      })),
    };

    try {
      await createDineInOrderyOrder(payload);
      const sampleBon: BonData = {
        institutionName: "بون التحضير",
        invoiceNumber: "5000",
        invoiceDate: formatDate(new Date()),
        customerName: selectedCustomer?.customerName,
        items: cart.map((c) => ({ productName: c.name, quantity: c.qty })),
      };
      printPreparationBon(sampleBon);
      set({
        cart: [],
        dineInMode: null,
        discount: { value: 0, type: "pct" },
        selectedCustomer: null,
        screen: "home",
        orderNote: "",
      });
    } catch {}
  },

  handleAddItemsToExistingOrder: async ({ addItemsToOrder }) => {
    const { cart, selectedOrderId, holdingOrderId } = get();
    const orderId = selectedOrderId ?? holdingOrderId;

    const payload = {
      orderId,
      items: cart.map((c) => ({
        productId: c.productId,
        quantity: c.qty,
        discountValue: c.itemDiscount?.type === "flat" ? c.itemDiscount.value : 0,
        discountPercentage: c.itemDiscount?.type === "pct" ? c.itemDiscount.value : 0,
      })),
      additionIds: cart.flatMap((c) => (c.extras ?? []).map((e) => e.id!)).filter(Boolean),
      notes: "",
    };

    try {
      await addItemsToOrder({ data: payload, id: orderId });
      set({
        cart: [],
        discount: { value: 0, type: "pct" },
        selectedOrderId: null,
        selectedCustomer: null,
        screen: "home",
        orderNote: "",
      });
    } catch {}
  },

  handleConfirmPayment: async ({ printKitchenBon = true, isHolding = false, payments: externalPayments, createTakwayOrder, createDeliveryOrder, checkoutDineInOrder, releaseHolding, customers }) => {
    const { cart, discount, selectedCustomer, selectedGiftCardId, selectedTable, selectedVaultId, paidAmount, orderType, holdingOrderId, orderNote, selectedOrderId, handleReleaseHoldingOrder, resetCart } = get();

    const payments: CreateSalesOrder["payments"] = isHolding
      ? []
      : (externalPayments?.map((p) => ({
          amount: p.amount,
          treasuryId: p.treasuryId,
          notes: p.notes,
          paymentMethod: "Cash",
        })) ?? [
          {
            amount: paidAmount,
            paymentMethod: "Cash",
            treasuryId: selectedVaultId!,
            notes: "",
          },
        ]);

    const basePayload = {
      customerId: selectedCustomer?.id,
      warehouseId: 1,
      notes: orderNote,
      globalDiscountValue: discount.type === "flat" ? discount.value : 0,
      globalDiscountPercentage: discount.type === "pct" ? discount.value : 0,
      giftCardId: selectedGiftCardId,
      additionIds: cart.flatMap((c) => (c.extras ?? []).map((e) => e.id!)).filter(Boolean),
      items: cart.map((cat) => {
        const beforeTax = cat.taxCalculation === 1 ? cat.price : Math.round((cat.price / (1 + cat.taxPercentage / 100)) * 100) / 100;
        return {
          productId: cat?.productId,
          quantity: cat?.qty,
          discountValue: cat?.itemDiscount?.type === "flat" ? cat?.itemDiscount?.value : 0,
          discountPercentage: cat?.itemDiscount?.type === "pct" ? cat?.itemDiscount?.value : 0,
          unitPrice: beforeTax,
        };
      }),
      payments,
      isHolding,
      holdingOrderId: holdingOrderId ? holdingOrderId : 0,
    };

    try {
      if (orderType === "TakeAway" || orderType === "Delivery") {
        if (holdingOrderId && !isHolding) {
          await handleReleaseHoldingOrder(payments, { releaseHolding, customers });
          return;
        }
        if (orderType === "TakeAway") {
          await createTakwayOrder(basePayload);
        } else {
          await createDeliveryOrder(basePayload);
        }
      } else if (orderType === "InDine") {
        await checkoutDineInOrder({
          tableId: Number(selectedTable),
          globalDiscountValue: discount.type === "flat" ? discount.value : 0,
          globalDiscountPercentage: discount.type === "pct" ? discount.value : 0,
          giftCardId: selectedGiftCardId,
          payments: isHolding ? [] : [{ amount: paidAmount, treasuryId: selectedVaultId!, notes: "" }],
        });
        set({ dineInMode: null });
      }

      if (!isHolding) {
        const hasItemDiscounts = cart.some((item) => item.itemDiscount && item.itemDiscount.value > 0);
        const totals = calcTotals(cart, hasItemDiscounts ? { type: "pct", value: 0 } : discount);
        const discountAmount = hasItemDiscounts
          ? cart.reduce((acc, item) => {
              const raw = itemBasePriceRaw(item);
              const afterDisc = itemBasePrice(item);
              return acc + (raw - afterDisc);
            }, 0)
          : totals.discountAmount;

        const invoiceData: InvoiceData = {
          logoUrl: LOGO_URL,
          invoiceNumber: `—`,
          institutionName: INSTITUTION_NAME,
          institutionTaxNumber: INSTITUTION_TAX_NO,
          invoiceDate: formatDate(new Date()),
          institutionAddress: INSTITUTION_ADDRESS,
          institutionPhone: INSTITUTION_PHONE,
          customerName: selectedCustomer?.customerName ?? undefined,
          customerPhone: undefined,
          items: cart.map((item) => {
            const base = itemBasePrice(item);
            const tax = calcItemTax(item);
            return {
              productName: item.name,
              quantity: item.qty,
              unitPrice: Number(base.toFixed(2)),
              taxAmount: Number(tax.toFixed(2)),
              total: Number((base + tax).toFixed(2)),
            };
          }),
          subTotal: Number(totals.sub.toFixed(2)),
          discountAmount: Number(discountAmount),
          taxAmount: totals.originalTax,
          grandTotal: totals.total,
          notes: INSTITUTION_NOTES,
        };

        const sampleBon: BonData = {
          institutionName: "بون التحضير",
          invoiceNumber: "5000",
          invoiceDate: formatDate(new Date()),
          customerName: selectedCustomer?.customerName,
          items: cart.map((c) => ({ productName: c.name, quantity: c.qty })),
        };

        await printInvoice(invoiceData);
        if (printKitchenBon && orderType !== "InDine") {
          await printPreparationBon(sampleBon);
        }
      }

      resetCart(customers);
    } catch {}
  },
}));
