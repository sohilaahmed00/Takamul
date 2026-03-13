import React, { useEffect, useMemo, useState } from "react";
import { X, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import { useCustomers } from "@/context/CustomersContext";
import { useLanguage } from "@/context/LanguageContext";
import ResponsiveModal from "./ResponsiveModal";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Country = { id: number; countryName: string };
type City = { id: number; cityName?: string; name?: string };
type StateItem = { id: number; stateName?: string; name?: string };

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function getName(o: any) {
  return o?.countryName ?? o?.cityName ?? o?.stateName ?? o?.name ?? "";
}

export default function AddCustomerModal({
  isOpen,
  onClose,
}: AddCustomerModalProps) {
  const { t, direction } = useLanguage();
  const { addCustomer } = useCustomers();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    mobile: "",
    pricingGroup: "عام",
    customerGroup: "عام",
    taxNumber: "",
    actualBalance: 0,
    commercialRegister: "",
    creditLimit: 0,
    stopSellingOverdue: false,
    isTaxable: false,
    address: "",
    postalCode: "",
    isActive: true,

    countryId: 0,
    cityId: 0,
    stateId: 0,

    city: "",
    state: "",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    setLoadingCountries(true);

    apiGet<Country[]>("/api/Location/countries")
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch(() =>
        showToast("error", t("login_network_error") || "فشل تحميل الدول")
      )
      .finally(() => setLoadingCountries(false));
  }, [isOpen, t]);

  useEffect(() => {
    if (!isOpen) return;

    if (!formData.countryId) {
      setCities([]);
      setStates([]);
      return;
    }

    setLoadingCities(true);
    setCities([]);
    setStates([]);

    setFormData((prev) => ({
      ...prev,
      cityId: 0,
      stateId: 0,
      city: "",
      state: "",
    }));

    apiGet<City[]>(`/api/Location/countries/${formData.countryId}/cities`)
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() =>
        showToast("error", t("login_network_error") || "فشل تحميل المدن")
      )
      .finally(() => setLoadingCities(false));
  }, [formData.countryId, isOpen, t]);

  useEffect(() => {
    if (!isOpen) return;

    if (!formData.cityId) {
      setStates([]);
      return;
    }

    setLoadingStates(true);
    setStates([]);

    setFormData((prev) => ({
      ...prev,
      stateId: 0,
      state: "",
    }));

    apiGet<StateItem[]>(`/api/Location/cities/${formData.cityId}/states`)
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch(() =>
        showToast(
          "error",
          t("login_network_error") || "فشل تحميل المحافظات/الولايات"
        )
      )
      .finally(() => setLoadingStates(false));
  }, [formData.cityId, isOpen, t]);

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === formData.countryId),
    [countries, formData.countryId]
  );

  const selectedCity = useMemo(
    () => cities.find((c: any) => c.id === formData.cityId),
    [cities, formData.cityId]
  );

  const selectedState = useMemo(
    () => states.find((s: any) => s.id === formData.stateId),
    [states, formData.stateId]
  );

  const resetForm = () => {
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      mobile: "",
      pricingGroup: "عام",
      customerGroup: "عام",
      taxNumber: "",
      actualBalance: 0,
      commercialRegister: "",
      creditLimit: 0,
      stopSellingOverdue: false,
      isTaxable: false,
      address: "",
      postalCode: "",
      isActive: true,
      countryId: 0,
      cityId: 0,
      stateId: 0,
      city: "",
      state: "",
    });

    setCities([]);
    setStates([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.countryId || !formData.cityId || !formData.stateId) {
      showToast("error", "من فضلك اختر الدولة والمدينة والمحافظة/الولاية");
      return;
    }

    if (formData.isTaxable && !formData.taxNumber.trim()) {
      showToast("error", t("tax_number_required") || "الرقم الضريبي مطلوب");
      return;
    }

    setSubmitting(true);

    const payload = {
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      mobile: formData.mobile.trim() || formData.phone.trim(),
      pricingGroup: formData.pricingGroup,
      customerGroup: formData.customerGroup,
      taxNumber: formData.isTaxable ? formData.taxNumber.trim() : "",
      actualBalance: Number(formData.actualBalance) || 0,
      commercialRegister: formData.commercialRegister.trim(),
      creditLimit: Number(formData.creditLimit) || 0,
      stopSellingOverdue: formData.stopSellingOverdue,
      isTaxable: formData.isTaxable,
      address: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      isActive: true,

      countryId: formData.countryId,
      cityId: formData.cityId,
      stateId: formData.stateId,

      city: getName(selectedCity),
      state: getName(selectedState),
      countryName: getName(selectedCountry),

      totalPoints: 0,
    };

    try {
      const res = await addCustomer(payload as any);

      if (res?.ok || res === true) {
        showToast(
          "success",
          t("operation_completed_successfully") || "تم الإضافة بنجاح"
        );
        resetForm();
        setTimeout(() => onClose(), 500);
      } else {
        showToast(
          "error",
          res?.message || t("login_network_error") || "فشل الإضافة"
        );
      }
    } catch {
      showToast("error", t("login_network_error") || "فشل الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        title={t("add_customer") || "إضافة عميل"}
        maxWidth="max-w-6xl"
      >
        <div dir={direction} className="relative">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="add-customer-modal-content"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl"
              >
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={t("close") || "إغلاق"}
                    type="button"
                  >
                    <X size={22} />
                  </button>

                  <div className="flex items-center gap-2 text-[#2ecc71]">
                    <h2 className="text-lg sm:text-xl font-bold">
                      {t("add_customer") || "إضافة عميل"}
                    </h2>
                    <UserPlus size={22} />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto"
                >
                  <p className="text-center text-gray-500 text-sm">
                    {t("required_fields_hint") ||
                      "برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة * إجبارية."}
                  </p>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <p className="text-center font-bold text-amber-800 text-sm">
                      {t("select_customer_type") || "برجاء تحديد نوع العميل"}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="isTaxable"
                          checked={!formData.isTaxable}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              isTaxable: false,
                              taxNumber: "",
                            })
                          }
                          className="w-4 h-4 accent-[#2ecc71]"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#2ecc71] transition-colors">
                          {t("not_tax_registered") ||
                            "فرد / شركة (غير مسجل بالضريبة)"}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="isTaxable"
                          checked={formData.isTaxable}
                          onChange={() =>
                            setFormData({ ...formData, isTaxable: true })
                          }
                          className="w-4 h-4 accent-[#2ecc71]"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#2ecc71] transition-colors">
                          {t("tax_registered") || "شركة (مسجل بالضريبة)"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    <Field label={t("customer_group") || "مجموعة العملاء"}>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] bg-gray-50"
                        value={formData.customerGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerGroup: e.target.value,
                          })
                        }
                      >
                        <option value="عام">{t("general") || "عام"}</option>
                      </select>
                    </Field>

                    <Field label={t("pricing_group") || "مجموعة التسعيرة"}>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] bg-gray-50"
                        value={formData.pricingGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricingGroup: e.target.value,
                          })
                        }
                      >
                        <option value="عام">{t("general") || "عام"}</option>
                      </select>
                    </Field>

                    <Field label={`${t("customer_name") || "اسم العميل"} *`}>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label={t("phone") || "هاتف"}>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </Field>

                    <Field label={t("mobile") || "موبايل"}>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                      />
                    </Field>

                    <Field
                      label={t("email_address") || "عنوان البريد الإلكتروني"}
                    >
                      <input
                        type="email"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </Field>

                    <Field
                      label={t("commercial_register") || "السجل التجاري"}
                    >
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.commercialRegister}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            commercialRegister: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field
                      label={
                        t("opening_balance_hint") ||
                        "رصيد افتتاحي *( المديونية بالسالب)"
                      }
                    >
                      <input
                        type="number"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] text-center"
                        value={formData.actualBalance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            actualBalance: Number(e.target.value),
                          })
                        }
                      />
                    </Field>

                    <Field label={t("credit_limit") || "الحد الائتماني"}>
                      <input
                        type="number"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] text-center"
                        value={formData.creditLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            creditLimit: Number(e.target.value),
                          })
                        }
                      />
                    </Field>

                    {formData.isTaxable && (
                      <Field label={`${t("tax_number") || "الرقم الضريبي"} *`}>
                        <input
                          type="text"
                          required={formData.isTaxable}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                          value={formData.taxNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxNumber: e.target.value,
                            })
                          }
                        />
                      </Field>
                    )}

                    <Field label="الدولة *">
                      <select
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] bg-white"
                        value={formData.countryId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countryId: Number(e.target.value) || 0,
                          })
                        }
                        disabled={loadingCountries}
                      >
                        <option value="">
                          {loadingCountries ? "جاري التحميل..." : "اختر الدولة"}
                        </option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.countryName}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="المدينة *">
                      <select
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] bg-white"
                        value={formData.cityId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cityId: Number(e.target.value) || 0,
                          })
                        }
                        disabled={!formData.countryId || loadingCities}
                      >
                        <option value="">
                          {!formData.countryId
                            ? "اختر الدولة أولاً"
                            : loadingCities
                            ? "جاري التحميل..."
                            : "اختر المدينة"}
                        </option>
                        {cities.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {getName(c)}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="المحافظة/الولاية *">
                      <select
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71] bg-white"
                        value={formData.stateId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stateId: Number(e.target.value) || 0,
                          })
                        }
                        disabled={!formData.cityId || loadingStates}
                      >
                        <option value="">
                          {!formData.cityId
                            ? "اختر المدينة أولاً"
                            : loadingStates
                            ? "جاري التحميل..."
                            : "اختر المحافظة/الولاية"}
                        </option>
                        {states.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {getName(s)}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="العنوان *">
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <Field label="الرمز البريدي">
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2ecc71]"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span className="text-sm font-medium text-gray-700">
                      {t("stop_selling_overdue") ||
                        "ايقاف البيع في حالة وجود مبالغ مستحقة"}
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.stopSellingOverdue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stopSellingOverdue: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-[#2ecc71] rounded"
                    />
                  </div>

                  <div className="flex justify-stretch sm:justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-[#00a65a] text-white px-6 sm:px-12 py-3 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60"
                    >
                      {submitting
                        ? t("saving") || "جارٍ الحفظ..."
                        : t("add_customer_button") ||
                          t("add_customer") ||
                          "إضافة عميل"}
                    </button>
                  </div>
                </form>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-[#2ecc71] text-right">
        {label}
      </label>
      {children}
    </div>
  );
}