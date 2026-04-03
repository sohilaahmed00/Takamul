import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Globe,
  List,
  LayoutGrid,
  PlusCircle,
  Tag,
  SlidersHorizontal,
  Factory,
  RefreshCcw,
  Gift,
  Share2,
  CornerUpLeft,
  Plus,
  DollarSign,
  RefreshCw,
  Monitor,
  User,
  Truck,
  Landmark,
  Banknote,
  Briefcase,
  Building,
  CreditCard,
  Store,
  Percent,
  Upload,
  Coins,
  Link,
  Folder,
  Wrench,
  Layers,
  Tags,
  Map,
  Grid3x3,
  Key,
  BarChart,
  Moon,
  Sun,
  Check,
  ArrowUpRight,
  ArrowLeftRight,
  HandCoins,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/context/SettingsContext";
import Logo from "@/components/Logo";
import WelcomeBanner from "@/components/WelcomeBanner";
import LogoModal from "@/components/modals/LogoModal";
import { ToastContainer } from "react-toastify";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSidebarOpen?: boolean;
  onClick?: () => void;
}

interface SubmenuItemProps {
  label: string;
  icon: LucideIcon;
  path?: string;
  state?: any;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  hasSubmenu,
  isOpen,
  isSidebarOpen = true,
  onClick,
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200",
        active
          ? "bg-[var(--primary)] text-white shadow-md"
          : "text-[var(--text-main)] hover:bg-[var(--bg-main)] hover:text-[var(--primary)]",
        !isSidebarOpen && "justify-center"
      )}
      title={!isSidebarOpen ? label : undefined}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        {isSidebarOpen && <span className="font-medium">{label}</span>}
      </div>

      {hasSubmenu && isSidebarOpen && (
        <ChevronLeft
          size={16}
          className={cn("transition-transform", isOpen && "-rotate-90")}
        />
      )}
    </button>
  );
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();
  const { language, direction, setLanguage, t } = useLanguage();
  const { systemSettings } = useSettings();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const headerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubmenu = (menu: string) => {
    if (!isSidebarOpen && !isMobile) {
      setIsSidebarOpen(true);
      setTimeout(() => setOpenSubmenu(menu), 150);
    } else {
      setOpenSubmenu(openSubmenu === menu ? null : menu);
    }
  };

  const toggleNestedSubmenu = (menu: string) => {
    setOpenNestedSubmenu(openNestedSubmenu === menu ? null : menu);
  };

  const showSidebarContent = isMobile ? true : isSidebarOpen;

  const closeAllMenus = () => {
    setActiveDropdown(null);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const SubmenuItem = ({ label, icon: Icon, path, state, onClick }: SubmenuItemProps) => {
    const isActive = path ? location.pathname === path : false;

    return (
      <button
        onClick={() => {
          if (onClick) {
            onClick();
          } else if (path) {
            navigate(path);
          }
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className={cn(
          "w-full p-2 text-sm rounded-md flex items-center gap-2 transition-colors group",
          isActive
            ? "bg-[var(--primary)] text-white"
            : "text-[var(--text-main)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)]",
          direction === "rtl" ? "text-right" : "text-left"
        )}
      >
        <Icon
          size={16}
          className={cn(
            isActive ? "text-white" : "text-[var(--text-main)] group-hover:text-[var(--primary)]"
          )}
        />
        <span>{label}</span>
      </button>
    );
  };

  const NestedSubmenu = ({ label, icon: Icon, children, isOpen, onToggle }: any) => {
    return (
      <div className="w-full">
        <button
          onClick={onToggle}
          className={cn(
            "w-full p-2 text-sm text-[var(--text-main)] hover:text-[var(--primary)] rounded-md hover:bg-[var(--bg-main)] flex items-center justify-between transition-colors group",
            direction === "rtl" ? "text-right" : "text-left"
          )}
        >
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-[var(--text-main)] group-hover:text-[var(--primary)]" />
            <span>{label}</span>
          </div>
          <ChevronLeft
            size={14}
            className={cn(
              "transition-transform text-[var(--text-main)] group-hover:text-[var(--primary)]",
              isOpen && "-rotate-90"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={cn(
                "overflow-hidden space-y-1 mt-1",
                direction === "rtl"
                  ? "mr-4 border-r border-[var(--border)] pr-2"
                  : "ml-4 border-l border-[var(--border)] pl-2"
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handleThemeChange = (value: string) => {
    if (typeof setTheme === "function") {
      setTheme(value as any);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300" dir={direction}>
      <ToastContainer />

      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        data-theme={theme}
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-[var(--bg-card)] z-50 overflow-y-auto transition-colors duration-300",
          direction === "rtl"
            ? "right-0 border-l border-[var(--border)]"
            : "left-0 border-r border-[var(--border)]"
        )}
        initial={false}
        animate={{
          x: isMobile ? (isMobileMenuOpen ? 0 : direction === "rtl" ? "100%" : "-100%") : 0,
          width: isMobile ? 280 : isSidebarOpen ? 256 : 80,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-4 flex items-center justify-between h-16 border-b border-[var(--border)]">
          <div className={cn("flex items-center gap-2 overflow-hidden", !showSidebarContent && "justify-center w-full")}>
            {showSidebarContent ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <Logo />
                {systemSettings?.site?.companyName && (
                  <span className="font-bold text-lg text-[var(--primary)] truncate">
                    {systemSettings.site.companyName}
                  </span>
                )}
              </div>
            ) : (
              <Logo showText={false} />
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="p-3 space-y-1">
          <SidebarItem
            icon={LayoutDashboard}
            label={t("dashboard")}
            isSidebarOpen={showSidebarContent}
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />

          <SidebarItem
            icon={Package}
            label={t("products")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "products"}
            onClick={() => toggleSubmenu("products")}
          />
          <AnimatePresence>
            {openSubmenu === "products" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("products_list")} icon={List} path="/products" />
                <SubmenuItem label={t("add_product")} icon={PlusCircle} path="/products/create" />
                <SubmenuItem label={t("print_barcode")} icon={Tag} path="/products/barcode" />
                <SubmenuItem
                  label={t("quantity_adjustments")}
                  icon={SlidersHorizontal}
                  path="/products/quantity-adjustments"
                />
                <SubmenuItem label={t("groups")} icon={Folder} path="/products/groups" />
                <SubmenuItem label={t("units")} icon={Wrench} path="/products/units" />
                <SubmenuItem label={t("additions")} icon={Folder} path="/products/additions" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={ShoppingCart}
            label={t("sales")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "sales"}
            onClick={() => toggleSubmenu("sales")}
          />
          <AnimatePresence>
            {openSubmenu === "sales" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("all_sales")} icon={List} path="/sales/all" />
                <SubmenuItem label={t("invoices_a4")} icon={FileText} path="/sales/a4-invoices" />
                <SubmenuItem label={t("invoices_pos")} icon={RefreshCcw} path="/sales/pos-invoices" />
                <SubmenuItem label={t("gift_cards")} icon={Gift} path="/sales/gift-cards" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Share2}
            label={t("quotes")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "quotes"}
            onClick={() => toggleSubmenu("quotes")}
          />
          <AnimatePresence>
            {openSubmenu === "quotes" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("quotes_list")} icon={List} path="/quotes" />
                <SubmenuItem label={t("add_quote")} icon={PlusCircle} path="/quotes/create" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={CornerUpLeft}
            label={t("purchases")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "purchases"}
            onClick={() => toggleSubmenu("purchases")}
          />
          <AnimatePresence>
            {openSubmenu === "purchases" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("purchases_list")} icon={List} path="/purchases" />
                <SubmenuItem label={t("add_purchase")} icon={Plus} path="/purchases/create" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Users}
            label={t("users")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "users"}
            onClick={() => toggleSubmenu("users")}
          />
          <AnimatePresence>
            {openSubmenu === "users" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("users_list")} icon={List} path="/users" />
                <SubmenuItem label={t("user_groups")} icon={Users} path="/users/groups" />
                <SubmenuItem label={t("pos_devices")} icon={Monitor} path="/users/pos-devices" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={User}
            label={t("customers")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "customers"}
            onClick={() => toggleSubmenu("customers")}
          />
          <AnimatePresence>
            {openSubmenu === "customers" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("customers_list")} icon={List} path="/customers" />
                <SubmenuItem label={t("cash_receipt_bond")} icon={HandCoins} path="/customers/collections" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Truck}
            label={t("suppliers")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "suppliers"}
            onClick={() => toggleSubmenu("suppliers")}
          />
          <AnimatePresence>
            {openSubmenu === "suppliers" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("suppliers_list")} icon={LayoutGrid} path="/suppliers" />
                <SubmenuItem label={t("cash_payment_bond")} icon={Truck} path="/suppliers/payments" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Landmark}
            label={t("treasuries")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "treasurys"}
            onClick={() => toggleSubmenu("treasurys")}
          />
          <AnimatePresence>
            {openSubmenu === "treasurys" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("treasuries_list")} icon={List} path="/treasurys" />
                <SubmenuItem label={t("treasury_statement")} icon={ArrowUpRight} path="/treasury/external-transfers" />
                <SubmenuItem label={t("internal_transfers")} icon={ArrowLeftRight} path="/treasury/internal-transfers" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Building}
            label={t("branches")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "branches"}
            onClick={() => toggleSubmenu("branches")}
          />
          <AnimatePresence>
            {openSubmenu === "branches" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("branches_list")} icon={List} path="/branches" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Store}
            label={t("warehouses")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "warehouses"}
            onClick={() => toggleSubmenu("warehouses")}
          />
          <AnimatePresence>
            {openSubmenu === "warehouses" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("warehouses_list")} icon={List} path="/warehouses" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Banknote}
            label={t("revenues_and_expenses")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "revenues_and_expenses"}
            onClick={() => toggleSubmenu("revenues_and_expenses")}
          />
          <AnimatePresence>
            {openSubmenu === "revenues_and_expenses" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("revenues")} icon={ArrowUpRight} path="/revenues" />
                <SubmenuItem label={t("expenses")} icon={DollarSign} path="/expenses" />
                <SubmenuItem label={t("items")} icon={List} path="/items" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={BarChart}
            label={t("reports")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "reports"}
            onClick={() => toggleSubmenu("reports")}
          />
          <AnimatePresence>
            {openSubmenu === "reports" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem
                  label={t("sales_report_by_category")}
                  icon={List}
                  path="/reports/sales-by-category"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem
            icon={Settings}
            label={t("settings")}
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === "settings"}
            onClick={() => toggleSubmenu("settings")}
          />
          <AnimatePresence>
            {openSubmenu === "settings" && showSidebarContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 pr-2",
                  direction === "rtl"
                    ? "mr-4 border-r border-gray-100"
                    : "ml-4 border-l border-gray-100 pl-2 pr-0"
                )}
              >
                <SubmenuItem label={t("system_settings")} icon={Settings} path="/settings/system" />
                <SubmenuItem label={t("payment_companies")} icon={CreditCard} path="/settings/payment-companies" />
                <SubmenuItem label={t("payment_methods")} icon={CreditCard} path="/settings/payment-methods" />
                <SubmenuItem label={t("pos_settings")} icon={Store} path="/settings/pos" />
                <SubmenuItem label={t("delivery_companies")} icon={Truck} path="/settings/delivery-companies" />
                <SubmenuItem label={t("delegates_and_employees")} icon={Users} path="/settings/delegates" />
                <SubmenuItem label={t("promotions")} icon={Percent} path="/promotions" />
                <SubmenuItem
                  label={t("change_logo")}
                  icon={Upload}
                  onClick={() => {
                    setIsLogoModalOpen(true);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                />
                <SubmenuItem label={t("currencies")} icon={Coins} path="/settings/currencies" />
                <SubmenuItem label={t("customer_groups")} icon={Link} path="/settings/customer-groups" />
                <SubmenuItem label={t("pricing_groups")} icon={DollarSign} path="/settings/price-groups" />
                <SubmenuItem label={t("basic_categories")} icon={Briefcase} path="/settings/basic-categories" />
                <SubmenuItem label={t("expense_categories")} icon={Folder} path="/settings/expense-categories" />
                <SubmenuItem label={t("units")} icon={Wrench} path="/products/units" />
                <SubmenuItem label={t("brands")} icon={Layers} path="/settings/brands" />
                <SubmenuItem label={t("variants")} icon={Tags} path="/settings/variants" />
                <SubmenuItem label={t("tax_rates")} icon={DollarSign} path="/settings/tax-rates" />
                <SubmenuItem label={t("regions")} icon={Map} path="/settings/regions" />
                <SubmenuItem label={t("delegates")} icon={Users} path="/settings/delegates" />
                <SubmenuItem label={t("tables")} icon={Grid3x3} path="/settings/tables" />
                <SubmenuItem label={t("warehouses")} icon={Building} path="/settings/warehouses" />
                <SubmenuItem label={t("branches")} icon={Building} path="/settings/branches" />
                <SubmenuItem label={t("production_machines")} icon={Factory} path="/settings/production-machines" />
                <SubmenuItem label={t("group_permissions")} icon={Key} path="/settings/groups" />
                <SubmenuItem label={t("site_logins")} icon={FileText} />
                <SubmenuItem label={t("reports")} icon={BarChart} path="/reports" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          ref={headerRef}
          data-theme={theme}
          className="bg-[var(--bg-card)] h-16 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 transition-colors duration-300"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-lg"
            >
              <Menu size={24} />
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center bg-[var(--input-bg)] rounded-xl px-4 py-2 w-72 border border-[var(--border)] focus-within:border-[var(--primary)] transition-all">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder={t("search")}
                className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-main)] placeholder-[var(--text-muted)] px-2"
                dir={direction}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate("/sales/create")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <LayoutGrid size={13} />
                <span>{t("sales_a4_quick")}</span>
              </button>

              <button
                onClick={() => navigate("/sales/pos")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <ShoppingCart size={13} />
                <span>{t("pos_quick")}</span>
              </button>

              <button
                onClick={() => navigate("/sales/all")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-full transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <List size={13} />
                <span>{t("all_sales")}</span>
              </button>

              <button
                onClick={() => navigate("/products/create")}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <Package size={13} />
                <span>{t("add_product")}</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "notifications" ? null : "notifications")
                }
                className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <AnimatePresence>
                {activeDropdown === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute mt-2 w-80 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-2 z-50",
                      "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-80",
                      direction === "rtl" ? "sm:left-0" : "sm:right-0"
                    )}
                  >
                    <div className="px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                      <h3 className="font-bold text-[var(--text-main)]">{t("notifications")}</h3>
                      <span className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--primary)]">
                        {t("view_all")}
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                            <ShoppingCart size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-main)]">{t("new_order")}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">{t("order_desc")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                            <RefreshCw size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-main)]">{t("system_update")}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">{t("update_desc")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mt-1">
                            <Package size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-main)]">{t("low_stock")}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">{t("stock_desc")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "theme" ? null : "theme")}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full"
              >
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <AnimatePresence>
                {activeDropdown === "theme" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute mt-2 w-44 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50",
                      "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-44",
                      direction === "rtl" ? "sm:left-0" : "sm:right-0"
                    )}
                  >
                    <button
                      onClick={() => handleThemeChange("light")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Sun size={16} />
                        <span>{t("light_mode")}</span>
                      </div>
                      {theme === "light" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => handleThemeChange("dark")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Moon size={16} />
                        <span>{t("dark_mode")}</span>
                      </div>
                      {theme === "dark" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => handleThemeChange("red")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <span>{t("red_theme")}</span>
                      </div>
                      {theme === "red" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => handleThemeChange("blue")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                        <span>{t("blue_theme")}</span>
                      </div>
                      {theme === "blue" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => handleThemeChange("yellow")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                        <span>{t("yellow_theme")}</span>
                      </div>
                      {theme === "yellow" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => handleThemeChange("high-contrast")}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-black border border-white" />
                        <span>{t("high_contrast")}</span>
                      </div>
                      {theme === "high-contrast" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "language" ? null : "language")}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full"
              >
                <Globe size={20} />
              </button>

              <AnimatePresence>
                {activeDropdown === "language" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute mt-2 w-40 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50",
                      "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-40",
                      direction === "rtl" ? "sm:left-0" : "sm:right-0"
                    )}
                  >
                    <button
                      onClick={() => {
                        setLanguage("ar");
                        setActiveDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <span>{t("arabic")}</span>
                      {language === "ar" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => {
                        setLanguage("en");
                        setActiveDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <span>{t("english")}</span>
                      {language === "en" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>

                    <button
                      onClick={() => {
                        setLanguage("ur");
                        setActiveDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between"
                    >
                      <span>{t("urdu")}</span>
                      {language === "ur" && <Check size={16} className="text-[var(--primary)]" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-[var(--border)] mx-1"></div>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "user" ? null : "user")}
                className="flex items-center gap-2 p-1 hover:bg-[var(--bg-main)] rounded-lg"
              >
                <img
                  src="https://picsum.photos/seed/avatar/100/100"
                  alt="User"
                  className="w-8 h-8 rounded-full border border-[var(--border)]"
                />
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-[var(--text-main)]">{t("admin")}</p>
                  <p className="text-xs text-[var(--text-muted)]">Admin</p>
                </div>
                <ChevronDown size={16} className="text-[var(--text-muted)]" />
              </button>

              <AnimatePresence>
                {activeDropdown === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute mt-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50",
                      direction === "rtl" ? "left-0" : "right-0"
                    )}
                  >
                    <button className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2">
                      <Users size={16} />
                      {t("profile")}
                    </button>

                    <button
                      onClick={() => {
                        navigate("/settings/system");
                        closeAllMenus();
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2"
                    >
                      <Settings size={16} />
                      {t("settings")}
                    </button>

                    <div className="h-px bg-[var(--border)] my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("takamul_token");
                        localStorage.removeItem("takamul_refresh_token");
                        navigate("/");
                        closeAllMenus();
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      {t("logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {location.pathname === "/dashboard" && <WelcomeBanner />}
          <Outlet />
        </main>
      </div>

      <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    </div>
  );
}