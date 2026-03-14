import React, { useEffect, useMemo, useState } from "react";
import { X, UserPlus } from "lucide-react";
import Toast from "../Toast";
import { useCustomers } from "@/context/CustomersContext";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function getName(o: any) {
  return o?.countryName ?? o?.cityName ?? o?.stateName ?? o?.name ?? "";
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
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

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    apiGet<Country[]>("/api/Location/countries")
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch(() => showToast("error", "فشل تحميل الدول"));
  }, [isOpen]);

  useEffect(() => {
    if (!formData.countryId) {
      setCities([]);
      return;
    }

    apiGet<City[]>(`/api/Location/countries/${formData.countryId}/cities`)
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() => showToast("error", "فشل تحميل المدن"));
  }, [formData.countryId]);

  useEffect(() => {
    if (!formData.cityId) {
      setStates([]);
      return;
    }

    apiGet<StateItem[]>(`/api/Location/cities/${formData.cityId}/states`)
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch(() => showToast("error", "فشل تحميل المحافظات"));
  }, [formData.cityId]);

  const selectedCountry = useMemo(() => countries.find((c) => c.id === formData.countryId), [countries, formData.countryId]);

  const selectedCity = useMemo(() => cities.find((c: any) => c.id === formData.cityId), [cities, formData.cityId]);

  const selectedState = useMemo(() => states.find((s: any) => s.id === formData.stateId), [states, formData.stateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("first")
    e.preventDefault();
    // if (submitting) return;

    // if (!formData.countryId || !formData.cityId || !formData.stateId) {
    //   showToast("error", "من فضلك اختر الدولة والمدينة والمحافظة");
    //   return;
    // }

    // setSubmitting(true);

    const payload = {
      ...formData,
      city: getName(selectedCity),
      state: getName(selectedState),
      countryName: getName(selectedCountry),
    };
    console.log(payload)
    return

    try {
      const res = await addCustomer(payload as any);

      if (res?.ok || res === true) {
        showToast("success", "تم الإضافة بنجاح");
        onClose();
      } else {
        showToast("error", "فشل الإضافة");
      }
    } catch {
      showToast("error", "فشل الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
          <DialogHeader className="py-3">
            <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
              <UserPlus size={20} />
              {t("add_customer") || "إضافة عميل"}
            </DialogTitle>
          </DialogHeader>
          <form id="addCustomerForm" onSubmit={handleSubmit} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
              <Field>
                <FieldLabel htmlFor="customerName">{t("customer_name") || "اسم العميل"} *</FieldLabel>
                <Input id="customerName" required placeholder="أدخل اسم العميل..." value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">{t("phone") || "هاتف"}</FieldLabel>

                <Input id="phone" placeholder="أدخل رقم الهاتف..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </Field>

              <Field>
                <FieldLabel htmlFor="mobile">{t("mobile") || "موبايل"}</FieldLabel>

                <Input id="mobile" placeholder="أدخل رقم الموبايل..." value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="commercialRegister">{t("commercial_register") || "السجل التجاري"}</FieldLabel>

                <Input id="commercialRegister" placeholder="أدخل رقم السجل التجاري..." value={formData.commercialRegister} onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })} />
              </Field>

              <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 my-2 ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">التسجيل الضريبي</h3>
                    <p className="text-sm text-gray-500 mt-1">قم بتفعيل هذا الخيار إذا كان العميل مسجلاً في ضريبة القيمة المضافة.</p>
                  </div>
                  <Switch className="scale-130 cursor-pointer" onCheckedChange={(checked) => setFormData({ ...formData, isTaxable: checked })} />{" "}
                </div>

                {formData.isTaxable && (
                  <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Field>
                      <FieldLabel htmlFor="taxNumber">{t("tax_number") || "الرقم الضريبي"} *</FieldLabel>

                      <Input id="taxNumber" placeholder="أدخل الرقم الضريبي..." value={formData.taxNumber} onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })} />
                    </Field>
                  </div>
                )}
              </div>

              <Field>
                <FieldLabel htmlFor="countryId">الدولة *</FieldLabel>

                <Select value={formData.countryId ? String(formData.countryId) : ""} onValueChange={(value) => setFormData({ ...formData, countryId: Number(value), cityId: 0, stateId: 0 })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الدولة..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.countryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="cityId">المدينة *</FieldLabel>

                <Select value={formData.cityId ? String(formData.cityId) : ""} onValueChange={(value) => setFormData({ ...formData, cityId: Number(value), stateId: 0 })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المدينة..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {getName(c)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="stateId">المحافظة *</FieldLabel>

                <Select value={formData.stateId ? String(formData.stateId) : ""} onValueChange={(value) => setFormData({ ...formData, stateId: Number(value) })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المحافظة..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {states.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {getName(s)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="postalCode">الرمز البريدي</FieldLabel>

                <Input id="postalCode" placeholder="أدخل الرمز البريدي..." value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
              </Field>

              <div className="col-span-1 md:col-span-2">
                <Field>
                  <FieldLabel htmlFor="address">العنوان التفصيلي *</FieldLabel>

                  <Input id="address" required placeholder="الشارع، رقم المبنى، تفاصيل إضافية..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </Field>
              </div>
            </div>
            
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button form="addCustomerForm" className="h-12 px-6 text-base" type="submit" >
                {submitting ? t("saving") || "جارٍ الحفظ..." : t("add_customer_button") || t("add_customer") || "إضافة عميل"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </>
  );
}
