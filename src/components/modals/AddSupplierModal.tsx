import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as CloseIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSuppliers } from "@/context/SuppliersContext";
import ResponsiveModal from "./ResponsiveModal";
import Toast from "../Toast";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any;
}

export default function AddSupplierModal({
  isOpen,
  onClose,
  supplier,
}: AddSupplierModalProps) {
  const { t, direction } = useLanguage();
  const { addSupplier, updateSupplier } = useSuppliers();

  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const getInitialFormData = () => ({
    supplierName: supplier?.supplierName ?? supplier?.name ?? "",
    taxNumber: supplier?.taxNumber ?? "",
    commercialRegistration: supplier?.commercialRegistration ?? "",
    openingBalance: supplier?.openingBalance ?? 0,

    email: supplier?.email ?? "",
    phone: supplier?.phone ?? "",
    mobile: supplier?.mobile ?? supplier?.phone ?? "",

    address: supplier?.address ?? "",
    city: supplier?.city ?? "",
    state: supplier?.state ?? "",
    country: supplier?.country ?? "",
    postalCode: supplier?.postalCode ?? "",

    paymentTerms: supplier?.paymentTerms ?? 30,
    isActive: supplier?.isActive ?? true,
  });

  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
  }, [supplier, isOpen]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  const resetForm = () => {
    setFormData({
      supplierName: "",
      taxNumber: "",
      commercialRegistration: "",
      openingBalance: 0,
      email: "",
      phone: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      paymentTerms: 30,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierName.trim()) {
      return showToast("error", t("please_enter_supplier_name"));
    }

    if (!formData.mobile.trim()) {
      return showToast("error", t("mobile_required"));
    }

    if (!formData.city.trim()) {
      return showToast("error", t("city_required"));
    }

    if (!formData.state.trim()) {
      return showToast("error", t("state_required"));
    }

    if (!formData.country.trim()) {
      return showToast("error", t("country_required"));
    }

    if (!formData.postalCode.trim()) {
      return showToast("error", t("postal_code_required"));
    }

    setIsLoading(true);

    try {
      const payload = {
        supplierName: formData.supplierName.trim(),
        name: formData.supplierName.trim(),
        taxNumber: formData.taxNumber.trim(),
        commercialRegistration: formData.commercialRegistration.trim(),
        openingBalance: Number(formData.openingBalance) || 0,

        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mobile: formData.mobile.trim(),

        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        postalCode: formData.postalCode.trim(),

        paymentTerms: Number(formData.paymentTerms || 30),
        isActive: formData.isActive,
      };

      const supplierId = supplier?.id ?? supplier?._id ?? supplier?.supplierId;

      const result = supplier
        ? await updateSupplier(supplierId, payload as any)
        : await addSupplier(payload as any);

      if (result?.ok === true) {
        showToast(
          "success",
          supplier
            ? t("supplier_updated_successfully")
            : t("supplier_added_successfully")
        );

        setTimeout(() => {
          onClose();
          if (!supplier) resetForm();
        }, 500);
      } else {
        showToast("error", result?.message || t("operation_failed"));
      }
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : t("operation_failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        title={supplier ? t("edit_supplier") : t("add_supplier")}
        maxWidth="max-w-3xl"
      >
        <div dir={direction} className="relative">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="supplier-modal-content"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl"
              >
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <button
                    onClick={onClose}
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    aria-label={t("close")}
                  >
                    <CloseIcon size={20} />
                  </button>

                  <h2 className="text-lg sm:text-xl font-bold text-[#2ecc71]">
                    {supplier ? t("edit_supplier") : t("add_supplier")}
                  </h2>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
                  <p className="text-sm text-gray-500 mb-6 text-center">
                    {t("please_enter_info_below")}
                  </p>

                  <form id="supplier-form-modal" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <Field label={`${t("supplier_name")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.supplierName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              supplierName: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={`${t("mobile")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.mobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobile: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={t("phone")}>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={t("email_address")}>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={t("tax_number")}>
                        <input
                          type="text"
                          value={formData.taxNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxNumber: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={t("commercial_registration")}>
                        <input
                          type="text"
                          value={formData.commercialRegistration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              commercialRegistration: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={t("opening_balance")}>
                        <input
                          type="number"
                          value={formData.openingBalance}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              openingBalance: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-center"
                        />
                      </Field>

                      <Field label={t("payment_terms_days")}>
                        <input
                          type="number"
                          value={formData.paymentTerms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentTerms: Number(e.target.value),
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-center"
                        />
                      </Field>
                    </div>

                    <Field label={t("address")}>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                      />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <Field label={`${t("city")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              city: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={`${t("state")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              state: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={`${t("country")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>

                      <Field label={`${t("postal_code")} *`}>
                        <input
                          type="text"
                          required
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2ecc71] text-right"
                        />
                      </Field>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <span className="text-sm font-medium text-gray-700">{t("active")}</span>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-[#2ecc71]"
                      />
                    </div>
                  </form>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-stretch sm:justify-end">
                  <button
                    type="submit"
                    form="supplier-form-modal"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-[#00a65a] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#008d4c] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? t("loading")
                      : supplier
                        ? t("update")
                        : t("add_supplier")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveModal>

      <Toast
        isOpen={toastOpen}
        message={toastMsg}
        type={toastType}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 block text-right">
        {label}
      </label>
      {children}
    </div>
  );
}