import { usePos } from "@/context/PosContext";
import CartPanel from "../cart/CartPanel";
import CashierPanel from "../cashier/CashierPanel";

/**
 * RightPanel occupies a fixed 450px slot on the right.
 * - On "cashier" screen  → shows CashierPanel (numpad + payment)
 * - On screens that have a cart (home, customers) → shows CartPanel
 * - On other screens (orders, tables, reports, settings, etc.) → hidden (null)
 */

const SCREENS_WITH_CART = ["home", "customers"];
const SCREENS_WITH_CASHIER = ["cashier"];
const SCREENS_WITHOUT_PANEL = ["tables", "orders", "reports", "settings", "success", "hold-list"];

export default function RightPanel() {
  const { screen } = usePos();

  if (SCREENS_WITH_CART.includes(screen)) return <CartPanel />;
  if (SCREENS_WITH_CASHIER.includes(screen)) return <CashierPanel />;
  return null; // tables, orders, reports, settings, etc.
}
