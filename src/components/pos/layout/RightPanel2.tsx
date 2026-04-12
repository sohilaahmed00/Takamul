import { usePos } from "@/context/PosContext";
import CartPanel from "../cart/CartPanel";
import CashierPanel from "../cashier/CashierPanel";
import OrderDetailPanel from "../orders/OrderDetailPanel";
import CartPanel2 from "../cart/CartPanel2";

const SCREENS_WITH_CART = ["home", "customers"];
const SCREENS_WITH_CASHIER = ["cashier"];
const SCREENS_WITH_ORDERS = ["orders"];

export default function RightPanel2() {
  const { screen, dineInMode, selectedOrderId } = usePos();
  console.log(screen);

  if (SCREENS_WITH_CASHIER.includes(screen)) return <CashierPanel />;
  if (SCREENS_WITH_CART.includes(screen)) return <CartPanel2 />;
  if (screen == "orders" && selectedOrderId) {
    return <OrderDetailPanel />;
  }
  return null;
}
