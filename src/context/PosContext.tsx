import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { INITIAL_CART, calcTotals, type CartItem, type HeldCart, type Screen, type OrderType, type NetworkSpeed } from "@/constants/data";

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

  // Network
  networkSpeed: NetworkSpeed;
}

const PosContext = createContext<PosContextValue | null>(null);

export function PosProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [discount, setDiscount] = useState(0);
  const [heldCarts, setHeldCarts] = useState<HeldCart[]>([]);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ method: "Cash", amount: "0.00" });
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>("fast");

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
    const { pay } = calcTotals(cart, discount);
    setHeldCarts((prev) => [
      ...prev,
      {
        note,
        items: [...cart],
        total: pay,
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

  const handleConfirmPayment = (method: string, amount: string) => {
    setSuccessInfo({ method, amount });
    setCart([]);
    setDiscount(0);
    setScreen("success");
  };

  return (
    <PosContext.Provider
      value={{
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
