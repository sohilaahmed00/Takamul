import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { INITIAL_CART, calcTotals, type CartItem, type HeldCart, type Screen, type OrderType, type NetworkSpeed } from "@/constants/data";
import { Customer } from "@/features/customers/types/customers.types";
import { useCreateTakwayOrder } from "@/features/pos/hooks/useCreateTakeawayOrder";
import { CreateTakeawayOrder } from "@/features/pos/types/pos.types";
import { useNavigate } from "react-router-dom";
import { GiftCard } from "@/features/gift-cards/types/giftCard.types";
import useToast from "@/hooks/useToast";
import { useCreateDeliveryOrder } from "@/features/pos/hooks/useCreateDeliveryOrder";

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
}

const PosContext = createContext<PosContextValue | null>(null);

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
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<number | null>(null);
  const [selectedVaultId, setSelectedVaultId] = useState<number | null>(null);

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

  const handleConfirmPayment = async (method: string, amount: string) => {
    if (!selectedVaultId) {
      notifyError("اختر الخزنة");
      return;
    }

    const payments = [
      {
        amount: paidAmount,
        treasuryId: selectedVaultId,
        // paymentMethod: "Cash",
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
      notes: "zz",
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
        // await createDineInOrder({ ...basePayload, tableId: selectedTable });
      } else if (orderType === "delivery") {
        await createDeliveryOrder(basePayload);
      }

      setSuccessInfo({ method, amount });
      setCart([]);
      setDiscount(0);
      setSelectedCustomer(null);
      setSelectedGiftCardId(null);
      setSelectedVaultId(null);
      setScreen("home");
    } catch (e) {
      notifyError("حدث خطأ أثناء إتمام الطلب");
    }
  };

  return (
    <PosContext.Provider
      value={{
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
