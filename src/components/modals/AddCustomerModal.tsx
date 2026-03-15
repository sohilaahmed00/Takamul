import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useGetAllCountries } from "@/features/locations/hooks/useGetAllCountries";
import { useGetCityWithCountryId } from "@/features/locations/hooks/useGetCityWithCountryId";
import { useGetStatesWithCityId } from "@/features/locations/hooks/useGetStatesWithCityId";
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import useToast from "@/hooks/useToast";
import axios from "axios";
import type { Customer } from "@/features/customers/types/customers.types";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export const customerSchema = z
  .object({
    customerName: z.string().min(3, "اسم العميل يجب أن يكون 3 أحرف على الأقل"),

    phone: z.string().min(1, "رقم الهاتف مطلوب").min(10, "رقم الموبايل غير صحيح"),

    mobile: z.string().min(1, "رقم الموبايل مطلوب").min(10, "رقم الموبايل غير صحيح"),

    commercialRegister: z.string().min(1, "السجل التجاري مطلوب"),

    isTaxable: z.boolean(),

    taxNumber: z.string().optional(),

    countryId: z.number().min(1, "يجب اختيار الدولة"),

    cityId: z.number().min(1, "يجب اختيار المدينة"),

    stateId: z.number().min(1, "يجب اختيار المحافظة"),

    postalCode: z.string().min(1, "الرمز البريدي مطلوب"),

    address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  })
  .refine((data) => !data.isTaxable || (data.taxNumber?.trim().length ?? 0) > 0, {
    message: "الرقم الضريبي مطلوب",
    path: ["taxNumber"],
  });
export default function AddCustomerModal({ isOpen, onClose, customer }: AddCustomerModalProps) {
  const { t } = useLanguage();

  const { data: countriesData } = useGetAllCountries();
  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { notifyError, notifySuccess } = useToast();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      mobile: "",
      address: "",
      postalCode: "",
      taxNumber: "",
      commercialRegister: "",
      isTaxable: false,
      countryId: 0,
      cityId: 0,
      stateId: 0,
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if (customer) {
      form.reset({
        customerName: customer.customerName ?? "",
        phone: customer.phone ?? "",
        mobile: customer.mobile ?? "",
        address: customer.address ?? "",
        postalCode: customer.postalCode ?? "",
        taxNumber: customer.taxNumber ?? "",
        commercialRegister: "",
        isTaxable: !!customer.taxNumber,
        countryId: 0,
        cityId: 0,
        stateId: 0,
      });
    } else {
      form.reset({
        customerName: "",
        phone: "",
        mobile: "",
        address: "",
        postalCode: "",
        taxNumber: "",
        commercialRegister: "",
        isTaxable: false,
        countryId: 0,
        cityId: 0,
        stateId: 0,
      });
    }
  }, [customer, isOpen]);
  const countryId = form.watch("countryId");
  const cityId = form.watch("cityId");
  const isTaxable = form.watch("isTaxable");

  const { data: citiesData } = useGetCityWithCountryId(countryId);
  const { data: statesdata } = useGetStatesWithCityId(cityId);

  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    try {
      const selectedCountry = countriesData?.find((c) => c.id === data.countryId);

      const selectedCity = citiesData?.find((c) => c.id === data.cityId);

      const selectedState = statesdata?.find((s) => s.id === data.stateId);

      const payload = {
        customerName: data.customerName,
        phone: data.phone ?? "",
        mobile: data.mobile ?? "",
        address: data.address,
        postalCode: data.postalCode ?? "",
        taxNumber: data.taxNumber ?? "",
        countryName: selectedCountry?.countryName ?? "",
        city: selectedCity?.cityName ?? "",
        state: selectedState?.statesName ?? "",
      };

      if (customer) {
        const res = await updateCustomer({ id: customer?.id, data: payload });
        notifySuccess("تم تعديل العميل بنجاح");
      } else {
        await createCustomer(payload);
        notifySuccess("تم إضافة العميل بنجاح");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        notifyError(message);
      }
    }
    form.reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
          <DialogHeader className="py-3">
            <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
              <UserPlus size={20} />
              {customer ? t("edit_customer") || "تعديل العميل" : t("add_customer") || "إضافة عميل"}
            </DialogTitle>
          </DialogHeader>

          <form id="addCustomerForm" onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
              {/* اسم العميل */}
              <Controller
                name="customerName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>اسم العميل *</FieldLabel>

                    <Input {...field} placeholder="أدخل اسم العميل..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* هاتف */}
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>هاتف*</FieldLabel>

                    <Input {...field} type="number" placeholder="أدخل رقم الهاتف..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* موبايل */}
              <Controller
                name="mobile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>موبايل*</FieldLabel>

                    <Input {...field} type="number" placeholder="أدخل رقم الموبايل..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* سجل تجاري */}
              <Controller
                name="commercialRegister"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>السجل التجاري*</FieldLabel>
                    <Input {...field} type="number" placeholder="أدخل رقم السجل التجاري..." />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* التسجيل الضريبي */}

              <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 my-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">التسجيل الضريبي</h3>

                    <p className="text-sm text-gray-500 mt-1">قم بتفعيل هذا الخيار إذا كان العميل مسجلاً في ضريبة القيمة المضافة.</p>
                  </div>

                  <Controller name="isTaxable" control={form.control} render={({ field }) => <Switch className="scale-130 cursor-pointer" checked={field.value} onCheckedChange={field.onChange} />} />
                </div>

                {isTaxable && (
                  <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Controller
                      name="taxNumber"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>الرقم الضريبي *</FieldLabel>
                          <Input {...field} placeholder="أدخل الرقم الضريبي..." />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* الدولة */}

              <Controller
                name="countryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>الدولة *</FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        form.setValue("cityId", 0);
                        form.setValue("stateId", 0);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الدولة..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {countriesData?.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.countryName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* المدينة */}

              <Controller
                name="cityId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>المدينة *</FieldLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        form.setValue("stateId", 0);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المدينة..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {citiesData?.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.cityName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* المحافظة */}

              <Controller
                name="stateId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>المحافظة *</FieldLabel>
                    <Select value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المحافظة..." />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {statesdata?.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.statesName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Field>
                <Controller
                  name="postalCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>الرمز البريدي*</FieldLabel>
                      <Input {...field} placeholder="أدخل الرمز البريدي..." />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </Field>

              <div className="col-span-1 md:col-span-2">
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>العنوان التفصيلي *</FieldLabel>
                      <Input {...field} placeholder="الشارع، رقم المبنى..." />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button form="addCustomerForm" className="h-12 px-6 text-base" type="submit">
              {customer ? "تعديل عميل" : "إضافة عميل"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
