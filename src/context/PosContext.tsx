import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { calcTotals, type CartItem, type HeldCart, type Screen, type OrderType, type NetworkSpeed, itemBasePrice, calcItemTax, itemBasePriceRaw } from "@/constants/data";
import { Customer } from "@/features/customers/types/customers.types";
import { useCreateTakwayOrder } from "@/features/pos/hooks/useCreateTakeawayOrder";
import { CreateTakeawayOrder } from "@/features/pos/types/pos.types";
import { useNavigate } from "react-router-dom";
import { GiftCard } from "@/features/gift-cards/types/giftCard.types";
import useToast from "@/hooks/useToast";
import { useCreateDeliveryOrder } from "@/features/pos/hooks/useCreateDeliveryOrder";
import { useCheckoutDineInOrder, useCreateDineInOrder } from "@/features/pos/hooks/useCreateDineInOrder";
import { checkoutDineInOrder } from "@/features/pos/services/pos";
import { useUpdateDineInOrder } from "@/features/pos/hooks/useUpdateDineInOrder";
import { InvoiceData, printInvoice } from "@/components/pos/orders/printInvoice";
import formatDate from "@/lib/formatDate";
import { BonData, printPreparationBon } from "@/components/pos/orders/printPreparationBon";

// ─── CONTEXT SHAPE ────────────────────────────────────────────────────────────
interface PosContextValue {
  // Navigation
  screen: Screen;
  setScreen: (s: Screen) => void;

  // Cart
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  discount: number;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;

  // Hold
  heldCarts: HeldCart[];
  showHoldModal: boolean;
  setShowHoldModal: (v: boolean) => void;
  handleHold: () => void;
  confirmHold: (note: string) => void;
  restoreHold: (idx: number) => void;

  // Payment success
  successInfo: { method: string; amount: string };
  handleConfirmPayment: (method: string, amount: string) => void;

  // Order type
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  selectedTable: string | null;
  setSelectedTable: (t: string | null) => void;
  selectedDelivery: string | null;
  setSelectedDelivery: (d: string | null) => void;

  //customer
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;

  selectedGiftCardId: number | null;
  setSelectedGiftCardId: (g: number | null) => void;

  selectedVaultId: number | null;
  setSelectedVaultId: (id: number | null) => void;

  paidAmount: number;
  setPaidAmount: React.Dispatch<React.SetStateAction<number>>;

  // Network
  networkSpeed: NetworkSpeed;

  handleCreateDineInOrder: () => Promise<void>;

  selectedOrderId: number | null;
  setSelectedOrderId: (id: number | null) => void;
  handleAddItemsToExistingOrder: () => Promise<void>;

  dineInMode: DineInMode;
  setDineInMode: (m: DineInMode) => void;
  search: string;
  setSearch: (m: string) => void;

  selectedItemIdx: number | null;
  setSelectedItemIdx: (idx: number | null) => void;
}

const PosContext = createContext<PosContextValue | null>(null);
export type DineInMode = "new-order" | "add-items" | "checkout" | null;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function PosProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ method: "Cash", amount: "0.00" });
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>("fast");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const { mutateAsync: createTakwayOrder } = useCreateTakwayOrder();
  const { mutateAsync: createDeliveryOrder } = useCreateDeliveryOrder();
  const { mutateAsync: createDineInOrderyOrder } = useCreateDineInOrder();
  const { mutateAsync: checkoutDineInOrder } = useCheckoutDineInOrder();
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<number | null>(null);
  const [selectedVaultId, setSelectedVaultId] = useState<number | null>(null);
  const { mutateAsync: addItemsToOrder } = useUpdateDineInOrder();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [dineInMode, setDineInMode] = useState<DineInMode>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const INSTITUTION_NAME = "اسم المؤسسة";
  const INSTITUTION_TAX_NO = "310XXXXXXXXX";
  const INSTITUTION_ADDRESS = "عنوان المؤسسة";
  const INSTITUTION_PHONE = "05XXXXXXXX";
  const INSTITUTION_NOTES = "";
  const LOGO_URL: string | undefined = undefined;
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (!connection) return;
    const update = () => {
      const mbps = connection.downlink;
      if (mbps < 1) setNetworkSpeed("slow");
      else if (mbps < 5) setNetworkSpeed("medium");
      else setNetworkSpeed("fast");
    };
    update();
    connection.addEventListener("change", update);
    return () => connection.removeEventListener("change", update);
  }, []);

  const handleHold = () => setShowHoldModal(true);

  const confirmHold = (note: string) => {
    const { total } = calcTotals(cart, discount);
    setHeldCarts((prev) => [
      ...prev,
      {
        note,
        items: [...cart],
        total,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setCart([]);
    setDiscount(0);
    setShowHoldModal(false);
    setScreen("hold-list");
  };

  const restoreHold = (idx: number) => {
    setCart([...heldCarts[idx].items]);
    setHeldCarts((prev) => prev.filter((_, i) => i !== idx));
    setDiscount(0);
    setScreen("home");
  };
  const addToCart = (item: { id: number; productNameAr: string; sellingPrice: number; taxAmount: number; taxCalculation: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.id);
      if (existing) {
        return prev.map((i) => (i.productId === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          name: item.productNameAr,
          price: item.sellingPrice,
          qty: 1,
          note: "",
          op: null,
          taxamount: item.taxAmount,
          productId: item.id,
          taxCalculation: item.taxCalculation,
        },
      ];
    });
  };

  const handleCreateDineInOrder = useCallback(async () => {
    const items = cart.map((c) => ({
      productId: c.productId,
      quantity: c.qty,
      discountValue: c.itemDiscount?.type === "flat" ? c.itemDiscount.value : 0,
      discountPercentage: c.itemDiscount?.type === "pct" ? c.itemDiscount.value : 0,
    }));

    const payload = {
      customerId: selectedCustomer?.id,
      warehouseId: 1,
      notes: "",
      globalDiscountValue: 0,
      globalDiscountPercentage: discount,
      giftCardId: selectedGiftCardId,
      additionIds: cart.flatMap((c) => (c.extras ?? []).map((e) => e.id!)).filter(Boolean),
      tableId: Number(selectedTable),
      items,
    };

    try {
      await createDineInOrderyOrder(payload);
      const sampleBon: BonData = {
        institutionName: "بون التحضير",
        invoiceNumber: "5000",
        invoiceDate: "2025-01-15 08:42",
        customerName: "Ahmed Mohamed",
        items: [
          { productName: "بيتزا كبير", quantity: 1 },
          { productName: "برجر لحم", quantity: 5 },
          { productName: "شاي أخضر", quantity: 6 },
          { productName: "قهوة تركي", quantity: 1 },
          { productName: "عصير برتقال", quantity: 3 },
        ],
      };

      printPreparationBon(sampleBon);
      setCart([]);
      setDineInMode(null);
      setDiscount(0);
      setSelectedCustomer(null);
      setScreen("home");
    } catch {
      // notifyError("حدث خطأ أثناء إنشاء الأوردر");
    }
  }, [cart, discount, selectedCustomer, selectedTable, selectedGiftCardId]);
  const handleAddItemsToExistingOrder = async () => {
    const payload = {
      orderId: selectedOrderId,
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
      await addItemsToOrder({ data: payload, id: selectedOrderId });
      setCart([]);
      setDiscount(0);
      setSelectedOrderId(null);
      setSelectedCustomer(null);
      setScreen("home");
    } catch {}
  };
  const handleConfirmPayment = async (method: string, amount: string) => {
    if (orderType !== "dine-in") {
      if (!selectedVaultId) {
        notifyError("اختر الخزنة");
        return;
      }
    }

    const payments = [
      {
        amount: paidAmount,
        treasuryId: 1,
        notes: "",
      },
    ];

    const items = cart.map((cat) => ({
      productId: cat?.productId,
      quantity: cat?.qty,
      discountValue: cat?.itemDiscount?.type === "flat" ? cat?.itemDiscount?.value : 0,
      discountPercentage: cat?.itemDiscount?.type === "pct" ? cat?.itemDiscount?.value : 0,
    }));

    const basePayload = {
      customerId: selectedCustomer?.id,
      warehouseId: 1,
      notes: "zzz",
      globalDiscountValue: 0,
      globalDiscountPercentage: discount,
      giftCardId: selectedGiftCardId,
      additionIds: cart.flatMap((c) => (c.extras ?? []).map((e) => e.id!)).filter(Boolean),
      items,
      payments,
    };

    try {
      if (orderType === "takeaway") {
        await createTakwayOrder(basePayload as CreateTakeawayOrder);
      } else if (orderType === "dine-in") {
        await checkoutDineInOrder({
          tableId: Number(selectedTable),
          globalDiscountValue: 0,
          globalDiscountPercentage: discount,
          giftCardId: selectedGiftCardId,
          payments: [
            {
              amount: paidAmount,
              treasuryId: selectedVaultId!,
              notes: "",
            },
          ],
        });
        setDineInMode(null);
      } else if (orderType === "delivery") {
        await createDeliveryOrder(basePayload);
      }

      const hasItemDiscounts = cart.some((item) => item.itemDiscount && item.itemDiscount.value > 0);
      const totals = calcTotals(cart, hasItemDiscounts ? 0 : discount);
      const discountAmount = hasItemDiscounts
        ? cart.reduce((acc, item) => {
            const raw = itemBasePriceRaw(item);
            const afterDisc = itemBasePrice(item);
            return acc + (raw - afterDisc);
          }, 0)
        : discount;

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
        discountAmount: Number(discountAmount.toFixed(2)),
        taxAmount: totals.originalTax,
        grandTotal: totals.total,
        notes: INSTITUTION_NOTES,
      };

      const sampleBon: BonData = {
        institutionName: "بون التحضير",
        invoiceNumber: "5000",
        invoiceDate: formatDate(new Date()),
        customerName: selectedCustomer?.customerName,
        items: cart?.map((cart) => ({
          productName: cart?.name,
          quantity: cart?.qty,
        })),
      };

      await printInvoice(invoiceData);
      // await sleep(1500);
      await printPreparationBon(sampleBon);

      setSuccessInfo({ method, amount });
      setCart([]);
      setDiscount(0);
      setSelectedCustomer(null);
      setSelectedGiftCardId(null);
      setSelectedVaultId(null);
      setScreen("home");
    } catch (e) {
      // notifyError("حدث خطأ أثناء إتمام الطلب");
    }
  };

  return (
    <PosContext.Provider
      value={{
        selectedItemIdx,
        setSelectedItemIdx,
        search,
        setSearch,
        setDineInMode,
        dineInMode,
        handleAddItemsToExistingOrder,
        selectedOrderId,
        setSelectedOrderId,
        handleCreateDineInOrder,
        selectedVaultId,
        setSelectedVaultId,
        selectedGiftCardId,
        setSelectedGiftCardId,
        paidAmount,
        setPaidAmount,
        selectedCustomer,
        setSelectedCustomer,
        screen,
        setScreen,
        cart,
        setCart,
        discount,
        setDiscount,
        heldCarts,
        showHoldModal,
        setShowHoldModal,
        handleHold,
        confirmHold,
        restoreHold,
        successInfo,
        handleConfirmPayment,
        orderType,
        setOrderType,
        selectedTable,
        setSelectedTable,
        selectedDelivery,
        setSelectedDelivery,
        networkSpeed,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export function usePos() {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be used inside PosProvider");
  return ctx;
}
