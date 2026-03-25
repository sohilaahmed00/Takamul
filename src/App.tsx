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
import TreasuryList from "@/pages/TreasurysList";
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
import { BanksProvider } from "@/context/BanksContext";
import { TransfersProvider } from "@/context/TransfersContext";
import { TreasurysProvider } from "@/context/TreasurysContext";
import ThermalReceipt from "@/components/ThermalReceipt";

function AppRoutes() {
  const { receiptData } = usePrint();

  return (
    <>
      <div className={`${receiptData ? "print:hidden" : ""} min-h-screen w-full`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

          {/* المنتجات */}
          <Route path="/products" element={<Layout><ProductsList /></Layout>} />
          <Route path="/products/create" element={<Layout><AddProduct /></Layout>} />
          <Route path="/products/edit/:id" element={<Layout><EditProduct /></Layout>} />
          <Route path="/products/import" element={<Layout><ImportProducts /></Layout>} />
          <Route path="/products/barcode" element={<Layout><PrintBarcode /></Layout>} />
          <Route path="/products/units" element={<Layout><Units /></Layout>} />
          <Route path="/products/additions" element={<Layout><Additions /></Layout>} />
          <Route path="/products/groups" element={<Layout><CategoriesList /></Layout>} />
          <Route path="/products/quantity-adjustments" element={<Layout><QuantityAdjustments /></Layout>} />
          <Route path="/products/quantity-adjustments/create" element={<Layout><AddQuantityAdjustment /></Layout>} />
          <Route path="/products/quantity-adjustments/import" element={<Layout><ImportQuantityAdjustment /></Layout>} />
          <Route path="/products/quantity-adjustments/edit/:id" element={<Layout><EditQuantityAdjustment /></Layout>} />
          <Route path="/products/quantity-adjustments/view/:id" element={<Layout><ViewQuantityAdjustment /></Layout>} />

          {/* المبيعات */}
          <Route path="/sales/a4-invoices" element={<Layout><A4Sales /></Layout>} />
          <Route path="/sales/a4-invoices/create" element={<Layout><CreateA4Invoice /></Layout>} />
          <Route path="/sales/add-tax-invoice" element={<Layout><AddTaxInvoice /></Layout>} />
          <Route path="/sales/add-simplified-tax-invoice" element={<Layout><AddSimplifiedTaxInvoice /></Layout>} />
          <Route path="/sales/import-csv" element={<Layout><ImportSales /></Layout>} />
          <Route path="/sales/create" element={<Layout><CreateSalesInvoice /></Layout>} />
          <Route path="/sales/all" element={<Layout><AllSales /></Layout>} />
          <Route path="/sales/pos-invoices" element={<Layout><POSInvoices /></Layout>} />
          <Route path="/sales/pos-invoices/:id" element={<Layout><POSInvoiceDetails /></Layout>} />
          <Route path="/sales/pos-invoices/return/:id" element={<Layout><ReturnPOSSale /></Layout>} />
          <Route path="/sales/gift-cards" element={<Layout><GiftCards /></Layout>} />
          <Route path="/sales/deliveries" element={<Layout><Deliveries /></Layout>} />
          <Route path="/sales/create-from-quote" element={<Layout><CreateSalesInvoice /></Layout>} />
          <Route path="/sales/return/:id" element={<Layout><ReturnSale /></Layout>} />
          <Route path="/sales/pos" element={<Layout><POS /></Layout>} />

          {/* نقطة البيع */}
          <Route path="/pos" element={<POSPage />} />

          {/* العروض */}
          <Route path="/quotes" element={<Layout><QuotesList /></Layout>} />
          <Route path="/quotes/create" element={<Layout><AddQuote /></Layout>} />
          <Route path="/quotes/view/:id" element={<Layout><ViewQuote /></Layout>} />

          {/* المشتريات */}
          <Route path="/purchases" element={<Layout><PurchasesList /></Layout>} />
          <Route path="/purchases/create" element={<Layout><AddPurchase /></Layout>} />
          <Route path="/purchases/edit/:id" element={<Layout><EditPurchase /></Layout>} />
          <Route path="/purchases/import-csv" element={<Layout><AddPurchaseCSV /></Layout>} />
          <Route path="/purchases/expenses" element={<Layout><Expenses /></Layout>} />
          <Route path="/suppliers" element={<Layout><SuppliersList /></Layout>} />
          <Route path="/expenses" element={<Layout><Expenses /></Layout>} />

          {/* العملاء */}
          <Route path="/customers" element={<Layout><CustomersList /></Layout>} />

          {/* المستخدمين */}
          <Route path="/users" element={<Layout><UsersList /></Layout>} />
          <Route path="/users/groups" element={<Layout><UserGroups /></Layout>} />
          <Route path="/users/create" element={<Layout><AddUser /></Layout>} />
          <Route path="/users/edit/:id" element={<Layout><EditUser /></Layout>} />
          <Route path="/users/pos-devices" element={<Layout><InvoiceDevices /></Layout>} />

          {/* الإعدادات */}
          <Route path="/settings/groups" element={<Layout><Groups /></Layout>} />
          <Route path="/settings/group-permissions/:id" element={<Layout><GroupPermissions /></Layout>} />
          <Route path="/treasurys" element={<Layout><TreasuryList /></Layout>} />
          <Route path="/treasury/external-transfers" element={<Layout><ExternalTransfersList /></Layout>} />
          <Route path="/treasury/internal-transfers" element={<Layout><InternalTransfersList /></Layout>} />
          <Route path="/settings/system" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/promotions" element={<Layout><Promotions /></Layout>} />
          <Route path="/settings/payment-companies" element={<Layout><PaymentCompanies /></Layout>} />
          <Route path="/settings/payment-methods" element={<Layout><PaymentMethods /></Layout>} />
          <Route path="/settings/pos" element={<Layout><POSSettings /></Layout>} />
          <Route path="/settings/currencies" element={<Layout><Currencies /></Layout>} />
          <Route path="/settings/customer-groups" element={<Layout><CustomerGroups /></Layout>} />
          <Route path="/settings/price-groups" element={<Layout><PriceGroups /></Layout>} />
          <Route path="/settings/basic-categories" element={<Layout><Categories /></Layout>} />
          <Route path="/settings/expense-categories" element={<Layout><ExpenseCategories /></Layout>} />
          <Route path="/settings/delivery-companies" element={<Layout><DeliveryCompanies /></Layout>} />
          <Route path="/settings/delegates" element={<Layout><Delegates /></Layout>} />
          <Route path="/settings/tables" element={<Layout><Tables /></Layout>} />
          <Route path="/settings/warehouses" element={<Layout><Warehouses /></Layout>} />
          <Route path="/settings/branches" element={<Layout><Branches /></Layout>} />

          {/* التقارير */}
          <Route path="/reports/sales-by-category" element={<Layout><SalesByCategoryReport /></Layout>} />
          <Route path="/reports/items" element={<Layout><ItemsReport /></Layout>} />
          <Route path="/reports/promotions" element={<Layout><PromotionsReport /></Layout>} />
          <Route path="/reports/low-stock" element={<Layout><LowStockReport /></Layout>} />
          <Route path="/reports/expiry-alert" element={<Layout><ExpiryReport /></Layout>} />
          <Route path="/reports/expiry-dates" element={<Layout><ExpiryReport /></Layout>} />
          <Route path="/reports/sales-purchases" element={<Layout><SalesPurchasesReport /></Layout>} />
          <Route path="/reports/stock-balance" element={<Layout><StockBalanceReport /></Layout>} />
          <Route path="/reports/item-movement" element={<Layout><ItemMovementReport /></Layout>} />
          <Route path="/reports/item-supply" element={<Layout><ItemSupplyReport /></Layout>} />
          <Route path="/reports/list-items" element={<Layout><ListItemsReport /></Layout>} />
          <Route path="/reports/out-of-stock" element={<Layout><OutOfStockReport /></Layout>} />
          <Route path="/reports/losing-items" element={<Layout><OutOfStockReport /></Layout>} />
          <Route path="/reports/stagnant-items" element={<Layout><StagnantItemsReport /></Layout>} />
          <Route path="/reports/categories" element={<Layout><CategoriesReport /></Layout>} />
          <Route path="/reports/brands" element={<Layout><BrandsReport /></Layout>} />
          <Route path="/reports/taxes" element={<Layout><TaxReport /></Layout>} />
          <Route path="/reports/purchases" element={<Layout><PurchasesReport /></Layout>} />
          <Route path="/reports/monthly-purchases" element={<Layout><MonthlyPurchasesReport /></Layout>} />
          <Route path="/reports/expenses" element={<Layout><ExpensesReport /></Layout>} />
          <Route path="/reports/charts-overview" element={<Layout><ChartsOverview /></Layout>} />
          <Route path="/reports/inventory-chart" element={<Layout><InventoryChart /></Layout>} />
          <Route path="/reports/best-sellers" element={<Layout><BestSellersChart /></Layout>} />
          <Route path="/reports/quantity-adjustments" element={<Layout><QuantityAdjustmentsReport /></Layout>} />
          <Route path="/reports/machine-adjustments" element={<Layout><MachineQuantityAdjustments /></Layout>} />
          <Route path="/reports/inventory-transfers" element={<Layout><InventoryTransfersReport /></Layout>} />
          <Route path="/reports/shifts" element={<Layout><ShiftsReport /></Layout>} />
          <Route path="/reports/list" element={<Layout><ListReport /></Layout>} />
          <Route path="/reports/payments" element={<Layout><PaymentsReport /></Layout>} />
          <Route path="/reports/summary-movements" element={<Layout><SummaryMovementsReport /></Layout>} />
          <Route path="/reports/bank" element={<Layout><BankReport /></Layout>} />
          <Route path="/reports/customers" element={<Layout><CustomersReport /></Layout>} />
          <Route path="/reports/customer-aging" element={<Layout><CustomerAgingReport /></Layout>} />
          <Route path="/reports/vendors" element={<Layout><VendorsReport /></Layout>} />
          <Route path="/reports/vendor-aging" element={<Layout><VendorAgingReport /></Layout>} />
          <Route path="/reports/employees" element={<Layout><EmployeesReport /></Layout>} />
          <Route path="/reports/reps" element={<Layout><RepsReport /></Layout>} />
          <Route path="/reports/daily-sales" element={<Layout><DailySalesReport /></Layout>} />
          <Route path="/reports/monthly-sales" element={<Layout><MonthlySalesReport /></Layout>} />
          <Route path="/reports/sales" element={<Layout><SalesReport /></Layout>} />
          <Route path="/reports/detailed-daily-sales" element={<Layout><DetailedDailySalesReport /></Layout>} />
          <Route path="/reports/cashier-sales-summary" element={<Layout><CashierSalesSummaryReport /></Layout>} />
          <Route path="/reports/sales-by-item-invoice" element={<Layout><SalesByItemInvoiceReport /></Layout>} />
          <Route path="/reports/reps-sales" element={<Layout><RepsSalesReport /></Layout>} />
          <Route path="/reports/influencer-percents" element={<Layout><InfluencerPercentsReport /></Layout>} />
          <Route path="/reports/search-invoice" element={<Layout><SearchInvoiceReport /></Layout>} />
          <Route path="/reports/unpaid-invoices" element={<Layout><UnpaidInvoicesReport /></Layout>} />
          <Route path="/reports/reservations" element={<Layout><ReservationsReport /></Layout>} />

          {/* التقارير المالية */}
          <Route path="/reports/balance-sheet" element={<Layout><BalanceSheet /></Layout>} />
          <Route path="/reports/income-statement" element={<Layout><IncomeStatement /></Layout>} />
          <Route path="/reports/ledger-statement" element={<Layout><LedgerStatement /></Layout>} />
          <Route path="/reports/trial-balance" element={<Layout><TrialBalance /></Layout>} />
          <Route path="/reports/subsidiary-ledger" element={<Layout><SubsidiaryLedger /></Layout>} />
          <Route path="/reports/financial-summary" element={<Layout><FinancialSummary /></Layout>} />

          {/* السندات */}
          <Route path="/bonds/receipt" element={<Layout><ReceiptBonds /></Layout>} />
          <Route path="/bonds/payment" element={<Layout><PaymentBonds /></Layout>} />
          <Route path="/bonds/deposit" element={<Layout><DepositBonds /></Layout>} />
          <Route path="/bonds/withdrawal" element={<Layout><WithdrawalBonds /></Layout>} />
        </Routes>
      </div>

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
    <BanksProvider>
      <TransfersProvider>
        <TreasurysProvider>
          <PrintProvider>
            <AppRoutes />
          </PrintProvider>
        </TreasurysProvider>
      </TransfersProvider>
    </BanksProvider>
  );
}
