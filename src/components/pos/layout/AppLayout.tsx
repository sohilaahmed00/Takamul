import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePos } from "@/context/PosContext";

// ─── Page imports ─────────────────────────────────────────────────────────────
// import CustomersPage from "@/pages/CustomersPage";
// import TablesPage from "@/pages/TablesPage";
// import OrdersPage from "@/pages/OrdersPage";
// import CashierPage from "@/pages/CashierPage";
// import SuccessPage from "@/pages/SuccessPage";
// import HoldListPage from "@/pages/HoldListPage";
// import PlaceholderPage from "@/pages/PlaceholderPage";
import RightPanel from "./RightPanel";
import HoldModal from "../modals/HoldModal";
import HomePage from "../pages/HomePage";
import TablesPage from "../pages/TablesPage";
import OrdersPage from "../pages/Orderspage";
import CashierPage from "../pages/Cashierpage";
import { SuccessPage } from "../pages/SuccessPage";
import { HoldListPage } from "../pages/Holdlistpage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { ItemNumPadPanel } from "../cart/Itemnumpadpanel";

function PageContent() {
  const { screen } = usePos();

  switch (screen) {
    case "home":
      return <HomePage />;
    case "cashier":
      return <CashierPage />;

    case "tables":
      return <TablesPage />;
    case "orders":
      return <OrdersPage />;

    case "success":
      return <SuccessPage />;
    case "hold-list":
      return <HoldListPage />;
    case "reports":
      return <PlaceholderPage label="Reports" />;
    case "settings":
      return <PlaceholderPage label="Settings" />;
    default:
      return <PlaceholderPage label="Coming Soon" />;
  }
}

export default function AppLayout() {
  const { showHoldModal, setShowHoldModal, confirmHold, setSelectedItemIdx, setCart, cart, selectedItemIdx } = usePos();

  return (
    <div className="relative flex h-screen  overflow-hidden rounded-xl border border-gray-200" style={{ minHeight: 600 }}>
      <ToastContainer pauseOnHover={false} />

      {/* Global overlay modal */}
      {showHoldModal && <HoldModal onClose={() => setShowHoldModal(false)} onConfirm={confirmHold} />}

      {/* ── Left: Sidebar (always visible) ── */}
      <Sidebar />

      {/* ── Center + Right: main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar (always visible) */}
        <Topbar />

        {/* Content row: page content + optional right panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page takes all remaining horizontal space */}
          <TooltipProvider>
            <div className="flex-1 overflow-y-auto min-w-0 p-4 bg-white dark:bg-background">
              {selectedItemIdx !== null && cart[selectedItemIdx] ? (
                <ItemNumPadPanel
                  item={cart[selectedItemIdx]}
                  onQtyChange={(qty) => {
                    setCart((prev) => prev.map((item, i) => (i === selectedItemIdx ? { ...item, qty } : item)));
                  }}
                  onDiscountChange={(disc) => {
                    setCart((prev) => prev.map((item, i) => (i === selectedItemIdx ? { ...item, itemDiscount: disc } : item)));
                  }}
                  onClose={() => setSelectedItemIdx(null)}
                />
              ) : (
                <PageContent />
              )}
            </div>
            {/* Right Panel */}
            <RightPanel />
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
