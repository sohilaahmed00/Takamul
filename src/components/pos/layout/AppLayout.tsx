import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePos } from "@/context/PosContext";

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
    <div className="relative flex h-screen overflow-hidden py-2 bg-[#000052]">
      <ToastContainer pauseOnHover={false} />

      {/* Modal */}
      {showHoldModal && <HoldModal onClose={() => setShowHoldModal(false)} onConfirm={confirmHold} />}

      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0 bg-white rounded-tr-[28px] rounded-lg">
        <div className="flex flex-1 overflow-hidden">
          <TooltipProvider>
            {/* Page + Topbar */}
            <div className="flex-1 overflow-y-auto min-w-0 bg-white flex flex-col">
              <div className="rounded-tr-[28px] overflow-hidden bg-white">
                <Topbar />
              </div>
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
