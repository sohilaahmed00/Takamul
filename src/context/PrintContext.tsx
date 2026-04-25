import React, { createContext, useContext, ReactNode } from "react";
import { printVoucher, getStockReceiptHTML, getClaimReceiptHTML } from "@/utils/customExportUtils";
import { getAllCustomers, getCustomerById } from "@/features/customers/services/customers";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "@/hooks/useBranch";
import useToast from "@/hooks/useToast";

interface PrintContextType {
  printInvoice: (data: any, type?: "invoice" | "stock" | "claim") => Promise<void>;
}

const PrintContext = createContext<PrintContextType>({} as PrintContextType);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const { data: branchInfo, isLoading: isBranchLoading, refetch: refetchBranch } = useBranch();
  const { notifyInfo, notifyError, notifySuccess } = useToast();

  const printInvoice = async (data: any, type: "invoice" | "stock" | "claim" = "invoice") => {
    if (!data?.id) return;

    const clean = (obj: any) => {
      if (!obj) return obj;
      const newObj = { ...obj };
      Object.keys(newObj).forEach((key) => {
        if (newObj[key] === "string" || newObj[key] === "null" || newObj[key] === "undefined") {
          newObj[key] = null;
        }
      });
      return newObj;
    };

    let currentBranchInfo = branchInfo;

    if (!currentBranchInfo) {
      if (isBranchLoading) {
        notifyInfo(t("loading_branch_info", "جاري تحميل بيانات الفرع..."));
        // انتظر قليلاً لعل البيانات تظهر
        await new Promise(r => setTimeout(r, 1000));
        const refetched = await refetchBranch();
        currentBranchInfo = refetched.data;
      } else {
        const refetched = await refetchBranch();
        currentBranchInfo = refetched.data;
      }
    }

    if (!currentBranchInfo) {
      notifyError(t("branch_info_required", "فشل تحميل بيانات الفرع، يرجى المحاولة مرة أخرى"));
      return;
    }

    const cleanedBranchInfo = clean(currentBranchInfo);
    const cleanedData = clean(data);

    const extendedData = {
      ...cleanedData,
      branchInfo: cleanedBranchInfo || cleanedData.branchInfo || null,
    };

    const rawName = (data.customerName || data.customer || "").toString().trim();
    const customerId = data.customerId;

    const normalize = (str: string) => {
      if (!str) return "";
      return str
        .replace(/[أإآا]/g, "ا")
        .replace(/[ىي]/g, "ي")
        .replace(/[ةه]/g, "ه")
        .replace(/\s+/g, "")
        .replace(/[\u064B-\u0652]/g, "")
        .toLowerCase();
    };

    if (!extendedData.customerPhone) {
      // ✅ تحسين: لو العميل افتراضي أو نقدي مش محتاجين نبحث في الـ API
      if (
        rawName &&
        (rawName.includes("افتراضي") || rawName.includes("نقدي") || rawName.includes("عام"))
      ) {
        extendedData.customerPhone = "-";
        extendedData.mobile = "-";
        extendedData.phone = "-";
      } else {
        notifyInfo(t("preparing_print", "جاري تجهيز البيانات للطباعة..."));
        let foundCustomer: any = null;

        // ✅ أولاً: جرب getCustomerById لو فيه customerId
        if (customerId) {
          try {
            foundCustomer = await getCustomerById(customerId);
          } catch {
            foundCustomer = null;
          }
        }

        // ✅ ثانياً: لو مفيش customerId أو فشل الـ request — ابحث بالاسم
        if (!foundCustomer && rawName) {
          try {
            const response = await getAllCustomers({ page: 1, limit: 10, searchTerm: rawName });
            const customers = response?.items || [];
            const searchTerm = normalize(rawName);
            foundCustomer = customers.find((c: any) => {
              const cName = normalize(c.customerName || "");
              return (
                cName === searchTerm ||
                cName.includes(searchTerm) ||
                searchTerm.includes(cName)
              );
            });
          } catch {
            foundCustomer = null;
          }
        }

        if (foundCustomer) {
          const phoneVal = foundCustomer.mobile || foundCustomer.phone || "";
          extendedData.customerPhone = phoneVal;
          extendedData.mobile = phoneVal;
          extendedData.phone = phoneVal;
        }
      }
    }

    let html = "";
    switch (type) {
      case "stock":
        html = getStockReceiptHTML(extendedData, t);
        printVoucher(html);
        notifySuccess(t("print_started", "بدأت عملية الطباعة"));
        break;
      case "claim":
        html = getClaimReceiptHTML(extendedData, t);
        printVoucher(html);
        notifySuccess(t("print_started", "بدأت عملية الطباعة"));
        break;
      case "invoice":
      default:
        window.open(`/sales/invoice/${extendedData.id}`, "_blank");
        break;
    }
  };

  return <PrintContext.Provider value={{ printInvoice }}>{children}</PrintContext.Provider>;
};

export const usePrint = () => useContext(PrintContext);