import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import type { createCustomer, Customer } from "@/features/customers/types/customers.types";

import { useCreateSupplier } from "@/features/suppliers/hooks/useCreateSupplier";
import { useUpdateSupplier } from "@/features/suppliers/hooks/useUpdateSupplier";
import type { createSupplier, Supplier } from "@/features/suppliers/types/suppliers.types";

import useToast from "@/hooks/useToast";

interface AddParnterModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: Customer | Supplier;
  type?: "supplier" | "customer";
}

export const createPartnerSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(3, t("validation_name_min_3")),

      phone: z.string().regex(/^\d+$/, t("validation_numbers_only")).min(10, t("validation_phone_invalid")),

      mobile: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: t("validation_numbers_only"),
        }),

      commercialRegister: z.string().optional(),

      isTaxable: z.boolean(),

      taxNumber: z.string().optional(),

      countryId: z.number().optional(),
      cityId: z.number().optional(),
      stateId: z.number().optional(),

      district: z.string().optional(),
      streetName: z.string().optional(),
      postalCode: z.string().optional(),

      buildingNumber: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: t("validation_numbers_only"),
        }),

      additionalNumber: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
          message: t("validation_numbers_only"),
        }),
    })
    .superRefine((data, ctx) => {
      if (data.isTaxable) {
        if (!data?.commercialRegister) {
          ctx.addIssue({
            path: ["commercialRegister"],
            message: t("validation_commercial_register_required"),
            code: z.ZodIssueCode.custom,
          });
        } else if (!/^\d+$/.test(data.commercialRegister)) {
          ctx.addIssue({
            path: ["commercialRegister"],
            message: t("validation_numbers_only"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.taxNumber) {
          ctx.addIssue({
            path: ["taxNumber"],
            message: t("validation_tax_number_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.countryId) {
          ctx.addIssue({
            path: ["countryId"],
            message: t("validation_country_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.cityId) {
          ctx.addIssue({
            path: ["cityId"],
            message: t("validation_region_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.stateId) {
          ctx.addIssue({
            path: ["stateId"],
            message: t("validation_city_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.district) {
          ctx.addIssue({
            path: ["district"],
            message: t("validation_district_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.streetName) {
          ctx.addIssue({
            path: ["streetName"],
            message: t("validation_street_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.postalCode) {
          ctx.addIssue({
            path: ["postalCode"],
            message: t("validation_postal_code_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.buildingNumber) {
          ctx.addIssue({
            path: ["buildingNumber"],
            message: t("validation_building_number_required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.additionalNumber) {
          ctx.addIssue({
            path: ["additionalNumber"],
            message: t("validation_additional_number_required"),
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

export default function AddParnterModal({ isOpen, onClose, partner, type = "customer" }: AddParnterModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: updateSupplier } = useUpdateSupplier();
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { notifySuccess, notifyError } = useToast();

  const isSupplier = type === "supplier";
  const schema = createPartnerSchema(t);

  const { data: countriesData } = useGetAllCountries();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      mobile: "",
      district: "",
      streetName: "",
      postalCode: "",
      taxNumber: "",
      commercialRegister: "",
      isTaxable: false,
      countryId: 0,
      cityId: 0,
      stateId: 0,
      buildingNumber: "",
      additionalNumber: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (partner && "customerName" in partner) {
      form.reset({
        name: partner.customerName ?? "",
        phone: partner.phone ?? "",
        mobile: partner.mobile ?? "",
        district: "",
        streetName: "",
        postalCode: partner.postalCode ?? "",
        taxNumber: partner.taxNumber ?? "",
        commercialRegister: "",
        isTaxable: !!partner.taxNumber,
        countryId: 0,
        cityId: 0,
        stateId: 0,
        buildingNumber: "",
        additionalNumber: "",
      });
    } else if (partner && "supplierName" in partner) {
      form.reset({
        name: partner.supplierName ?? "",
        phone: partner.phone ?? "",
        mobile: partner.mobile ?? "",
        district: "",
        streetName: "",
        postalCode: partner.postalCode ?? "",
        taxNumber: partner.taxNumber ?? "",
        // commercialRegister: partner.commercialRegister ?? "",
        isTaxable: !!partner.taxNumber,
        countryId: 0,
        cityId: 0,
        stateId: 0,
        buildingNumber: "",
        additionalNumber: "",
      });
    } else {
      form.reset({
        name: "",
        phone: "",
        mobile: "",
        district: "",
        streetName: "",
        postalCode: "",
        taxNumber: "",
        commercialRegister: "",
        isTaxable: false,
        countryId: 0,
        cityId: 0,
        stateId: 0,
        buildingNumber: "",
        additionalNumber: "",
      });
    }
  }, [partner, isOpen, form]);

  const countryId = form.watch("countryId");
  const cityId = form.watch("cityId");
  const isTaxable = form.watch("isTaxable");

  const { data: citiesData } = useGetCityWithCountryId(countryId);
  const { data: statesData } = useGetStatesWithCityId(cityId);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const selectedCountry = countriesData?.find((c) => c.id === data.countryId);
      const selectedCity = citiesData?.find((c) => c.id === data.cityId);
      const selectedState = statesData?.find((s) => s.id === data.stateId);

      type CreatePartnerPayload = createCustomer | createSupplier;
      let payload: CreatePartnerPayload;

      if (isSupplier) {
        payload = {
          supplierName: data.name,
          phone: data.phone,
          mobile: data.mobile ?? "",
          city: selectedCity?.cityName ?? "",
          state: selectedState?.statesName ?? "",
          country: selectedCountry?.countryName ?? "",
          postalCode: data.postalCode ?? "",
          taxNumber: data.taxNumber ?? "",
          buildingNumber: data.buildingNumber ?? "",
          additionalNumber: data.additionalNumber ?? "",
          commercialRegister: data.commercialRegister ?? "",
        };
      } else {
        payload = {
          customerName: data.name,
          phone: data.phone,
          mobile: data.mobile || "",
          postalCode: data.postalCode || "",
          taxNumber: data.taxNumber ?? "",
          country: selectedCountry?.countryName ?? "",
          city: selectedCity?.cityName ?? "",
          state: selectedState?.statesName ?? "",
        };
      }

      if (partner) {
        if (isSupplier) {
          await updateSupplier({ id: partner.id, data: payload as createSupplier });
        } else {
          await updateCustomer({ id: partner.id, data: payload as createCustomer });
        }
      } else {
        if (isSupplier) {
          await createSupplier(payload as createSupplier);
        } else {
          await createCustomer(payload as createCustomer);
        }
      }

      form.reset();
      onClose();
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || t("save_error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
            <UserPlus size={20} />
            {partner ? (isSupplier ? t("edit_supplier") : t("edit_customer")) : isSupplier ? t("add_supplier") : t("add_customer")}
          </DialogTitle>
        </DialogHeader>

        <form id="addPartnerForm" onSubmit={form.handleSubmit(onSubmit, (erors) => console.log(erors))} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{isSupplier ? t("supplier_name") : t("customer_name")} *</FieldLabel>
                  <Input {...field} placeholder={isSupplier ? t("enter_supplier_name") : t("enter_customer_name")} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("mobile")} *</FieldLabel>
                  <Input {...field} type="number" placeholder={t("enter_mobile")} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="col-span-1 md:col-span-2  border border-gray-200 rounded-2xl p-5 my-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">{t("national_address")}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t("tax_registration_helper_text")}</p>
                </div>

                <Controller name="isTaxable" control={form.control} render={({ field }) => <Switch className="scale-130 cursor-pointer" checked={field.value} onCheckedChange={field.onChange} />} />
              </div>

              {isTaxable && (
                <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300 grid gap-4 grid-cols-2">
                  <Controller
                    name="taxNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("tax_number")} *</FieldLabel>
                        <Input {...field} placeholder={t("enter_tax_number")} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="commercialRegister"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{t("commercial_register")} *</FieldLabel>
                        <Input {...field} type="number" placeholder={t("enter_commercial_register")} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              )}
            </div>

            {isTaxable && (
              <>
                <Controller
                  name="countryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("country")} *</FieldLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          form.setValue("cityId", 0);
                          form.setValue("stateId", 0);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("select_country")} />
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

                <Controller
                  name="cityId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("region")} *</FieldLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          form.setValue("stateId", 0);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("select_region")} />
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

                <Controller
                  name="stateId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("city")} *</FieldLabel>
                      <Select value={field.value ? String(field.value) : ""} onValueChange={(value) => field.onChange(Number(value))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("select_city")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {statesData?.map((s) => (
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

                <Controller
                  name="district"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("district")} *</FieldLabel>
                      <Input {...field} placeholder={t("enter_district")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="streetName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("street_name")} *</FieldLabel>
                      <Input {...field} placeholder={t("enter_street_name")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="additionalNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("additional_number")} *</FieldLabel>
                      <Input {...field} placeholder={t("enter_additional_number")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="buildingNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("building_number")} *</FieldLabel>
                      <Input {...field} placeholder={t("enter_building_number")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="postalCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>{t("postal_code")} *</FieldLabel>
                      <Input {...field} placeholder={t("enter_postal_code")} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button form="addPartnerForm" className="h-12 px-6 text-base" type="submit">
            {partner ? (isSupplier ? t("edit_supplier") : t("edit_customer")) : isSupplier ? t("add_supplier") : t("add_customer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
