import { usePos } from "@/context/PosContext";
import CartPanel from "../cart/CartPanel";
import CashierPanel from "../cashier/CashierPanel";

const SCREENS_WITH_CART = ["home", "customers"];
const SCREENS_WITH_CASHIER = ["cashier"];
const SCREENS_WITH_ORDERS = ["orders"];

export default function RightPanel() {
  const { screen, dineInMode, selectedOrderId } = usePos();
  console.log(screen);

  if (SCREENS_WITH_CASHIER.includes(screen)) return <CashierPanel />;
  if (SCREENS_WITH_CART.includes(screen)) return <CartPanel />;

  return null;
}
