/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyOTP from "@/pages/VerifyOTP";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import EditProduct from "@/pages/EditProduct";
import ImportProducts from "@/pages/ImportProducts";
import PrintBarcode from "@/pages/PrintBarcode";
import A4Sales from "@/pages/A4Sales";
import CreateA4Invoice from "@/pages/CreateA4Invoice";

import AllSales from "@/pages/AllSales";
import QuotesList from "@/pages/QuotesList";
import AddQuote from "@/pages/AddQuote";
import ViewQuote from "@/pages/ViewQuote";
import CreateSalesInvoice from "@/pages/CreateSalesInvoice";
import Units from "@/pages/Units";
import QuantityAdjustments from "@/pages/QuantityAdjustments";
import EditQuantityAdjustment from "@/pages/EditQuantityAdjustment";
import AddQuantityAdjustment from "@/pages/AddQuantityAdjustment";
import ImportQuantityAdjustment from "@/pages/ImportQuantityAdjustment";
import Layout from "@/components/Layout";
import ReturnSale from "@/pages/ReturnSale";
import POS from "@/pages/POS";
import POSInvoices from "@/pages/POSInvoices";
import POSInvoiceDetails from "@/pages/POSInvoiceDetails";
import ReturnPOSSale from "@/pages/ReturnPOSSale";
import GiftCards from "@/pages/GiftCards";
import Deliveries from "@/pages/Deliveries";
import PurchasesList from "@/pages/PurchasesList";
import AddPurchase from "@/pages/AddPurchase";
import EditPurchase from "@/pages/EditPurchase";
import AddPurchaseCSV from "@/pages/AddPurchaseCSV";
import CustomersList from "@/pages/CustomersList";
import SuppliersList from "@/pages/SuppliersList";
import Expenses from "@/pages/Expenses";
import AddTaxInvoice from "@/pages/AddTaxInvoice";
import AddSimplifiedTaxInvoice from "@/pages/AddSimplifiedTaxInvoice";
import ImportSales from "@/pages/ImportSales";
import ViewQuantityAdjustment from "@/pages/ViewQuantityAdjustment";
import CategoriesList from "./pages/CategoriesList";
import Additions from "./pages/Additions";
import AddProduct from "./pages/AddProduct";
import ProductsList from "./pages/ProductsList";
import POSPage from "./pages/Pos2";

// Users
import AddUser from "@/pages/AddUser";
import EditUser from "@/pages/EditUser";
import UsersList from "@/pages/UsersList";
import UserGroups from "@/pages/UserGroups";
import InvoiceDevices from "@/pages/InvoiceDevices";

// Settings
import Groups from "@/pages/Groups";
import GroupPermissions from "@/pages/GroupPermissions";
import ExternalTransfersList from "@/pages/ExternalTransfersList";
import InternalTransfersList from "@/pages/InternalTransfersList";
import SystemSettings from "@/pages/SystemSettings";
import Promotions from "@/pages/Promotions";
import PaymentCompanies from "@/pages/PaymentCompanies";
import PaymentMethods from "@/pages/PaymentMethods";
import POSSettings from "@/pages/POSSettings";
import Currencies from "@/pages/Currencies";
import CustomerGroups from "@/pages/CustomerGroups";
import PriceGroups from "@/pages/PriceGroups";
import Categories from "@/pages/Categories";
import ExpenseCategories from "@/pages/ExpenseCategories";
import DeliveryCompanies from "@/pages/DeliveryCompanies";
import Delegates from "@/pages/Delegates";
import Tables from "@/pages/Tables";
import Warehouses from "@/pages/Warehouses";
import Branches from "@/pages/Branches";

// Reports
import ItemsReport from "@/pages/reports/ItemsReport";
import PromotionsReport from "@/pages/reports/PromotionsReport";
import LowStockReport from "@/pages/reports/LowStockReport";
import ExpiryReport from "@/pages/reports/ExpiryReport";
import SalesPurchasesReport from "@/pages/reports/SalesPurchasesReport";
import StockBalanceReport from "@/pages/reports/StockBalanceReport";
import ItemMovementReport from "@/pages/reports/ItemMovementReport";
import ItemSupplyReport from "@/pages/reports/ItemSupplyReport";
import ListItemsReport from "@/pages/reports/ListItemsReport";
import OutOfStockReport from "@/pages/reports/OutOfStockReport";
import StagnantItemsReport from "@/pages/reports/StagnantItemsReport";
import CategoriesReport from "@/pages/reports/CategoriesReport";
import BrandsReport from "@/pages/reports/BrandsReport";
import TaxReport from "@/pages/reports/TaxReport";
import PurchasesReport from "@/pages/reports/PurchasesReport";
import MonthlyPurchasesReport from "@/pages/reports/MonthlyPurchasesReport";
import ExpensesReport from "@/pages/reports/ExpensesReport";
import ChartsOverview from "@/pages/reports/ChartsOverview";
import InventoryChart from "@/pages/reports/InventoryChart";
import BestSellersChart from "@/pages/reports/BestSellersChart";
import QuantityAdjustmentsReport from "@/pages/reports/QuantityAdjustmentsReport";
import MachineQuantityAdjustments from "@/pages/reports/MachineQuantityAdjustments";
import InventoryTransfersReport from "@/pages/reports/InventoryTransfersReport";
import ShiftsReport from "@/pages/reports/ShiftsReport";
import ListReport from "@/pages/reports/ListReport";
import PaymentsReport from "@/pages/reports/PaymentsReport";
import SummaryMovementsReport from "@/pages/reports/SummaryMovementsReport";
import BankReport from "@/pages/reports/BankReport";
import CustomersReport from "@/pages/reports/CustomersReport";
import CustomerAgingReport from "@/pages/reports/CustomerAgingReport";
import VendorsReport from "@/pages/reports/VendorsReport";
import VendorAgingReport from "@/pages/reports/VendorAgingReport";
import EmployeesReport from "@/pages/reports/EmployeesReport";
import RepsReport from "@/pages/reports/RepsReport";
import DailySalesReport from "@/pages/reports/DailySalesReport";
import MonthlySalesReport from "@/pages/reports/MonthlySalesReport";
import SalesReport from "@/pages/reports/SalesReport";
import DetailedDailySalesReport from "@/pages/reports/DetailedDailySalesReport";
import CashierSalesSummaryReport from "@/pages/reports/CashierSalesSummaryReport";
import SalesByItemInvoiceReport from "@/pages/reports/SalesByItemInvoiceReport";
import RepsSalesReport from "@/pages/reports/RepsSalesReport";
import InfluencerPercentsReport from "@/pages/reports/InfluencerPercentsReport";
import SalesByCategoryReport from "@/pages/reports/SalesByCategoryReport";
import SearchInvoiceReport from "@/pages/reports/SearchInvoiceReport";
import UnpaidInvoicesReport from "@/pages/reports/UnpaidInvoicesReport";
import ReservationsReport from "@/pages/reports/ReservationsReport";

// Financial Reports
import BalanceSheet from "@/pages/reports/accounts/BalanceSheet";
import IncomeStatement from "@/pages/reports/accounts/IncomeStatement";
import LedgerStatement from "@/pages/reports/accounts/LedgerStatement";
import TrialBalance from "@/pages/reports/accounts/TrialBalance";
import SubsidiaryLedger from "@/pages/reports/accounts/SubsidiaryLedger";
import FinancialSummary from "@/pages/reports/accounts/FinancialSummary";

// Bonds
import ReceiptBonds from "@/pages/bonds/ReceiptBonds";
import PaymentBonds from "@/pages/bonds/PaymentBonds";
import DepositBonds from "@/pages/bonds/DepositBonds";
import WithdrawalBonds from "@/pages/bonds/WithdrawalBonds";

// Print Context
import { PrintProvider, usePrint } from "@/context/PrintContext";
import ThermalReceipt from "@/components/ThermalReceipt";
import TreasurysList from "./pages/TreasurysList";
import CreateQuote from "./pages/CreateQuote";
import CustomerCollectionsList from "@/pages/CustomerCollectionsList";
import SupplierPaymentsList from "@/pages/SupplierPaymentsList";

function AppRoutes() {
  const { receiptData } = usePrint();

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* المنتجات */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/create" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<AddProduct />} />
          <Route path="/products/import" element={<ImportProducts />} />
          <Route path="/products/barcode" element={<PrintBarcode />} />
          <Route path="/products/units" element={<Units />} />
          <Route path="/products/additions" element={<Additions />} />
          <Route path="/products/groups" element={<CategoriesList />} />
          <Route path="/products/quantity-adjustments" element={<QuantityAdjustments />} />
          <Route path="/products/quantity-adjustments/create" element={<AddQuantityAdjustment />} />
          <Route path="/products/quantity-adjustments/import" element={<ImportQuantityAdjustment />} />
          <Route path="/products/quantity-adjustments/edit/:id" element={<AddQuantityAdjustment />} />
          <Route path="/products/quantity-adjustments/:mode/:id" element={<AddQuantityAdjustment />} />

          {/* المبيعات */}
          <Route path="/sales/a4-invoices" element={<A4Sales />} />
          <Route path="/sales/a4-invoices/create" element={<CreateA4Invoice />} />
          <Route path="/sales/add-tax-invoice" element={<AddTaxInvoice />} />
          <Route path="/sales/add-simplified-tax-invoice" element={<AddSimplifiedTaxInvoice />} />
          <Route path="/sales/import-csv" element={<ImportSales />} />
          <Route path="/sales/create" element={<CreateSalesInvoice />} />
          <Route path="/sales/all" element={<AllSales />} />
          <Route path="/sales/pos-invoices" element={<POSInvoices />} />
          <Route path="/sales/pos-invoices/:id" element={<POSInvoiceDetails />} />
          <Route path="/sales/pos-invoices/return/:id" element={<ReturnPOSSale />} />
          <Route path="/sales/gift-cards" element={<GiftCards />} />
          <Route path="/sales/deliveries" element={<Deliveries />} />
          <Route path="/sales/create-from-quote" element={<CreateSalesInvoice />} />
          <Route path="/sales/return/:id" element={<ReturnSale />} />
          <Route path="/sales/pos" element={<POS />} />

          {/* نقطة البيع */}
          <Route path="/pos" element={<POSPage />} />

          {/* العروض */}
          <Route path="/quotes" element={<QuotesList />} />
          <Route path="/quotes/create" element={<CreateQuote />} />
          <Route path="/quotes/view/:id" element={<ViewQuote />} />

          {/* المشتريات */}
          <Route path="/purchases" element={<PurchasesList />} />
          <Route path="/purchases/create" element={<AddPurchase />} />
          <Route path="/purchases/edit/:id" element={<EditPurchase />} />
          <Route path="/purchases/import-csv" element={<AddPurchaseCSV />} />
          <Route path="/purchases/expenses" element={<Expenses />} />
          <Route path="/suppliers" element={<SuppliersList />} />
          <Route path="/suppliers/payments" element={<SupplierPaymentsList />} />
          <Route path="/expenses" element={<Expenses />} />

          {/* العملاء */}
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/collections" element={<CustomerCollectionsList />} />

          {/* المستخدمين */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/groups" element={<UserGroups />} />
          <Route path="/users/create" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/users/pos-devices" element={<InvoiceDevices />} />

          {/* الإعدادات */}
          <Route path="/settings/groups" element={<Groups />} />
          <Route path="/settings/group-permissions/:id" element={<GroupPermissions />} />
          <Route path="/treasurys" element={<TreasurysList />} />
          <Route path="/treasury/external-transfers" element={<ExternalTransfersList />} />
          <Route path="/treasury/internal-transfers" element={<InternalTransfersList />} />
          <Route path="/settings/system" element={<SystemSettings />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/settings/payment-companies" element={<PaymentCompanies />} />
          <Route path="/settings/payment-methods" element={<PaymentMethods />} />
          <Route path="/settings/pos" element={<POSSettings />} />
          <Route path="/settings/currencies" element={<Currencies />} />
          <Route path="/settings/customer-groups" element={<CustomerGroups />} />
          <Route path="/settings/price-groups" element={<PriceGroups />} />
          <Route path="/settings/basic-categories" element={<Categories />} />
          <Route path="/settings/expense-categories" element={<ExpenseCategories />} />
          <Route path="/settings/delivery-companies" element={<DeliveryCompanies />} />
          <Route path="/settings/delegates" element={<Delegates />} />
          <Route path="/settings/tables" element={<Tables />} />
          <Route path="/settings/warehouses" element={<Warehouses />} />
          <Route path="/settings/branches" element={<Branches />} />

          {/* التقارير */}
          <Route path="/reports/sales-by-category" element={<SalesByCategoryReport />} />
          <Route path="/reports/items" element={<ItemsReport />} />
          <Route path="/reports/promotions" element={<PromotionsReport />} />
          <Route path="/reports/low-stock" element={<LowStockReport />} />
          <Route path="/reports/expiry-alert" element={<ExpiryReport />} />
          <Route path="/reports/expiry-dates" element={<ExpiryReport />} />
          <Route path="/reports/sales-purchases" element={<SalesPurchasesReport />} />
          <Route path="/reports/stock-balance" element={<StockBalanceReport />} />
          <Route path="/reports/item-movement" element={<ItemMovementReport />} />
          <Route path="/reports/item-supply" element={<ItemSupplyReport />} />
          <Route path="/reports/list-items" element={<ListItemsReport />} />
          <Route path="/reports/out-of-stock" element={<OutOfStockReport />} />
          <Route path="/reports/losing-items" element={<OutOfStockReport />} />
          <Route path="/reports/stagnant-items" element={<StagnantItemsReport />} />
          <Route path="/reports/categories" element={<CategoriesReport />} />
          <Route path="/reports/brands" element={<BrandsReport />} />
          <Route path="/reports/taxes" element={<TaxReport />} />
          <Route path="/reports/purchases" element={<PurchasesReport />} />
          <Route path="/reports/monthly-purchases" element={<MonthlyPurchasesReport />} />
          <Route path="/reports/expenses" element={<ExpensesReport />} />
          <Route path="/reports/charts-overview" element={<ChartsOverview />} />
          <Route path="/reports/inventory-chart" element={<InventoryChart />} />
          <Route path="/reports/best-sellers" element={<BestSellersChart />} />
          <Route path="/reports/quantity-adjustments" element={<QuantityAdjustmentsReport />} />
          <Route path="/reports/machine-adjustments" element={<MachineQuantityAdjustments />} />
          <Route path="/reports/inventory-transfers" element={<InventoryTransfersReport />} />
          <Route path="/reports/shifts" element={<ShiftsReport />} />
          <Route path="/reports/list" element={<ListReport />} />
          <Route path="/reports/payments" element={<PaymentsReport />} />
          <Route path="/reports/summary-movements" element={<SummaryMovementsReport />} />
          <Route path="/reports/bank" element={<BankReport />} />
          <Route path="/reports/customers" element={<CustomersReport />} />
          <Route path="/reports/customer-aging" element={<CustomerAgingReport />} />
          <Route path="/reports/vendors" element={<VendorsReport />} />
          <Route path="/reports/vendor-aging" element={<VendorAgingReport />} />
          <Route path="/reports/employees" element={<EmployeesReport />} />
          <Route path="/reports/reps" element={<RepsReport />} />
          <Route path="/reports/daily-sales" element={<DailySalesReport />} />
          <Route path="/reports/monthly-sales" element={<MonthlySalesReport />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/detailed-daily-sales" element={<DetailedDailySalesReport />} />
          <Route path="/reports/cashier-sales-summary" element={<CashierSalesSummaryReport />} />
          <Route path="/reports/sales-by-item-invoice" element={<SalesByItemInvoiceReport />} />
          <Route path="/reports/reps-sales" element={<RepsSalesReport />} />
          <Route path="/reports/influencer-percents" element={<InfluencerPercentsReport />} />
          <Route path="/reports/search-invoice" element={<SearchInvoiceReport />} />
          <Route path="/reports/unpaid-invoices" element={<UnpaidInvoicesReport />} />
          <Route path="/reports/reservations" element={<ReservationsReport />} />

          {/* التقارير المالية */}
          <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
          <Route path="/reports/income-statement" element={<IncomeStatement />} />
          <Route path="/reports/ledger-statement" element={<LedgerStatement />} />
          <Route path="/reports/trial-balance" element={<TrialBalance />} />
          <Route path="/reports/subsidiary-ledger" element={<SubsidiaryLedger />} />
          <Route path="/reports/financial-summary" element={<FinancialSummary />} />

          {/* السندات */}
          <Route path="/bonds/receipt" element={<ReceiptBonds />} />
          <Route path="/bonds/payment" element={<PaymentBonds />} />
          <Route path="/bonds/deposit" element={<DepositBonds />} />
          <Route path="/bonds/withdrawal" element={<WithdrawalBonds />} />
        </Route>
      </Routes>

      {receiptData && (
        <div className="hidden print:block print:m-0 print:p-0">
          <ThermalReceipt invoiceData={receiptData} />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <PrintProvider>
      <AppRoutes />
    </PrintProvider>
  );
}
