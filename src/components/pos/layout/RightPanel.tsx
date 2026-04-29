import { usePos } from "@/context/PosContext";
import CashierPanel from "../cashier/CashierPanel";
import CartPanel from "../cart/CartPanel";
import { usePosStore } from "@/features/pos/store/usePosStore";

const SCREENS_WITH_CART = ["home", "customers"];
const SCREENS_WITH_CASHIER = ["cashier"];
const SCREENS_WITH_ORDERS = ["orders"];

export default function RightPanel() {
  const { screen, dineInMode, selectedOrderId } = usePosStore();

  if (SCREENS_WITH_CASHIER.includes(screen)) return <CashierPanel />;
  if (SCREENS_WITH_CART.includes(screen)) return <CartPanel />;

  return null;
}
