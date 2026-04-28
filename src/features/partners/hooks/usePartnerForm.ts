// features/partners/hooks/usePartnerForm.ts
import { useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, UseFormSetValue, useForm } from "react-hook-form";
import { useLanguage } from "@/context/LanguageContext";
import { useGetAllCountries } from "@/features/locations/hooks/useGetAllCountries";
import { useGetCityWithCountryId } from "@/features/locations/hooks/useGetCityWithCountryId";
import { useGetStatesWithCityId } from "@/features/locations/hooks/useGetStatesWithCityId";

import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer";
import { useUpdateCustomer } from "@/features/customers/hooks/useUpdateCustomer";
import type { createCustomer, Customer } from "@/features/customers/types/customers.types";

import { useCreateSupplier } from "@/features/suppliers/hooks/useCreateSupplier";
import { useUpdateSupplier } from "@/features/suppliers/hooks/useUpdateSupplier";
import type { createSupplier, Supplier } from "@/features/suppliers/types/suppliers.types";
import { createPartnerSchema, PartnerFormValues } from "../schemas/partnerSchema";

interface UsePartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: Customer | Supplier;
  type?: "supplier" | "customer";
}

const defaultValues: PartnerFormValues = {
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
};

export function usePartnerForm({ isOpen, onClose, partner, type = "customer" }: UsePartnerFormProps) {
  const { t } = useLanguage();
  const isSupplier = type === "supplier";
  const schema = useMemo(() => createPartnerSchema(t), [t]);

  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const { mutateAsync: updateSupplier } = useUpdateSupplier();

  const { data: countriesData } = useGetAllCountries();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const countryId = form.watch("countryId");
  const cityId = form.watch("cityId");
  const isTaxable = form.watch("isTaxable");
  const stateId = form.watch("stateId");

  const { data: citiesData } = useGetCityWithCountryId(countryId);
  const { data: statesData } = useGetStatesWithCityId(cityId);

  const selectedCountry = useMemo(() => countriesData?.find((c) => c.id === countryId), [countriesData, countryId]);
  const selectedCity = useMemo(() => citiesData?.find((c) => c.id === cityId), [citiesData, cityId]);
  const selectedState = useMemo(() => statesData?.find((s) => s.id === form.getValues("stateId")), [statesData, stateId]);

  useEffect(() => {
    if (!isOpen || !countriesData) return;

    if (partner && "customerName" in partner) {
      form.reset({
        name: partner.customerName ?? "",
        phone: partner.phone ?? "",
        mobile: partner.mobile ?? "",
        district: "",
        streetName: partner?.address,
        postalCode: partner.postalCode ?? "",
        taxNumber: partner.taxNumber ?? "",
        commercialRegister: partner?.commercialRegister,
        isTaxable: !!partner.taxNumber,
        countryId: partner?.countryId,
        cityId: partner?.cityId,
        stateId: partner?.stateId,
        buildingNumber: partner?.buildingNumber,
        additionalNumber: partner?.additionalNumber,
      });
    } else if (partner && "supplierName" in partner) {
      form.reset({
        name: partner.supplierName ?? "",
        phone: partner.phone ?? "",
        mobile: partner.mobile ?? "",
        district: "",
        streetName: partner?.streetName,
        postalCode: partner.postalCode ?? "",
        taxNumber: partner.taxNumber ?? "",
        commercialRegister: partner.commercialRegister ?? "",
        isTaxable: !!partner.taxNumber,
        countryId: partner?.countryId,
        cityId: partner?.cityId,
        stateId: partner?.stateId,
        buildingNumber: partner?.buildingNumber,
        additionalNumber: partner?.additionalNumber,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [partner, isOpen, countriesData]);

  const onSubmit = async (data: PartnerFormValues) => {
    try {
      type CreatePartnerPayload = createCustomer | createSupplier;
      let payload: CreatePartnerPayload;

      if (isSupplier) {
        payload = {
          supplierName: data.name,
          phone: data.phone,
          city: selectedCity?.cityName ?? "",
          state: selectedState?.statesName ?? "",
          country: selectedCountry?.countryName ?? "",
          postalCode: data.postalCode ?? "",
          taxNumber: data.taxNumber ?? "",
          buildingNumber: data.buildingNumber ?? "",
          additionalNumber: data.additionalNumber ?? "",
          commercialRegister: data.commercialRegister ?? "",
          countryId: data?.countryId,
          cityId: data?.cityId,
          stateId: data?.stateId,
          address: data?.streetName,
        };
      } else {
        payload = {
          customerName: data.name,
          phone: data.phone,
          postalCode: data.postalCode || "",
          taxNumber: data.taxNumber ?? "",
          country: selectedCountry?.countryName ?? "",
          city: selectedCity?.cityName ?? "",
          state: selectedState?.statesName ?? "",
          additionalNumber: data?.additionalNumber,
          buildingNumber: data?.buildingNumber,
          commercialRegister: data?.commercialRegister,
          countryId: data?.countryId,
          cityId: data?.cityId,
          stateId: data?.stateId,
          address: data?.streetName,
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

      form.reset(defaultValues);
      onClose();
    } catch (error) {}
  };

  return {
    control: form.control as Control<PartnerFormValues>,
    setValue: form.setValue as UseFormSetValue<PartnerFormValues>,
    form,
    isTaxable,
    isSupplier,
    countriesData,
    citiesData,
    statesData,
    onSubmit,
  };
}
