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
import HomePage2 from "../pages/HomePage2";
import RightPanel2 from "./RightPanel2";
import Topbar2 from "./Topbar2";

function PageContent() {
  const { screen } = usePos();

  switch (screen) {
    case "home":
      return <HomePage2 />;
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

export default function AppLayout2() {
  const { showHoldModal, setShowHoldModal, confirmHold } = usePos();

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden rounded-xl border border-gray-200" style={{ minHeight: 600 }}>
      <ToastContainer pauseOnHover={false} />

      {showHoldModal && <HoldModal onClose={() => setShowHoldModal(false)} onConfirm={confirmHold} />}

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar2 />

        <TooltipProvider>
          <div className="flex flex-1 flex-col overflow-hidden p-4  space-y-5">
            {" "}
            {/* ← flex-col مش flex-row */}
            {/* Page — full width */}
            <div className="  min-w-0  ">
              {/* <PageContent /> */}
            </div>
            {/* Cart — full width من تحت */}
            <RightPanel2 />
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
