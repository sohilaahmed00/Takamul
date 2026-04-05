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
  const { showHoldModal, setShowHoldModal, confirmHold } = usePos();

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden rounded-xl border border-gray-200" style={{ minHeight: 600 }}>
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
            {/* Page */}
            <div className="flex-1 overflow-y-auto min-w-0 p-4 bg-gray-50">
              <PageContent />
            </div>

            {/* Right Panel */}
            <RightPanel />
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
