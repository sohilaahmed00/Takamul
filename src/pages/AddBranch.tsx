import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Loader2, MapPin, Pencil, Save, Upload, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ComboboxField from "@/components/ui/ComboboxField";

import { useGetCountries } from "@/features/Location/hooks/Usegetcountries";
import { useGetCities } from "@/features/Location/hooks/Usegetcities";
import { useGetStates } from "@/features/Location/hooks/Usegetstates";
import { useCreateBranch } from "@/features/Branches/hooks/Usecreatebranch";
import { useUpdateBranch } from "@/features/Branches/hooks/Useupdatebranch";
import { useGetBranchById } from "@/features/Branches/hooks/Usegetbranchbyid";

export default function AddBranch() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id, mode } = useParams<{ id?: string; mode?: string }>();
  const { notifyError, notifySuccess } = useToast();

  const isEditMode = !!id && mode !== "view";
  const isViewMode = mode === "view";
  const branchId = id ? Number(id) : undefined;

  const { data: branchDetail, isLoading: isLoadingDetail } = useGetBranchById(branchId);
  const { mutateAsync: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdating } = useUpdateBranch();
  const isPending = isCreating || isUpdating;

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [commercialRegister, setCommercialRegister] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [countryId, setCountryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [stateId, setStateId] = useState<number | null>(null);
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [subNumber, setSubNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const { data: countries } = useGetCountries();
  const { data: cities } = useGetCities(countryId);
  const { data: states } = useGetStates(cityId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!branchDetail) return;

    setCode(branchDetail.code ?? "");
    setName(branchDetail.name ?? "");
    setBusinessName(branchDetail.businessName ?? "");
    setEmail(branchDetail.email ?? "");
    setPhone(branchDetail.phone ?? "");
    setTaxNumber(branchDetail.taxNumber ?? "");
    setCommercialRegister(branchDetail.commercialRegister ?? "");
    setFooterNote(branchDetail.footerNote ?? "");
    setImageUrl(branchDetail.imageUrl ?? "");
    setImagePreview(branchDetail.imageUrl ?? null);
    setCountryId(branchDetail.countryId ?? null);
    setCityId(branchDetail.cityId ?? null);
    setStateId(branchDetail.stateId ?? null);
    setStreet(branchDetail.street ?? "");
    setBuildingNumber(branchDetail.buildingNumber ?? "");
    setSubNumber(branchDetail.subNumber ?? "");
    setPostalCode(branchDetail.postalCode ?? "");
  }, [branchDetail]);

  // Synced by ComboboxField internallly now

  const handleCountryChange = (val: string | number | null) => {
    setCountryId(val ? Number(val) : null);
    setCityId(null);
    setStateId(null);
  };

  const handleCityChange = (val: string | number | null) => {
    setCityId(val ? Number(val) : null);
    setStateId(null);
  };

  const handleImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        notifyError(t("invalid_image") || "يرجى اختيار ملف صورة");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    },
    [notifyError, t],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      notifyError(t("branch_code_required") || "كود الفرع مطلوب");
      return;
    }

    if (!name.trim()) {
      notifyError(t("branch_name_required") || "اسم الفرع مطلوب");
      return;
    }

    const payload = {
      code: code.trim(),
      name: name.trim(),
      imageUrl: imageUrl || undefined,
      businessName: businessName.trim() || undefined,
      commercialRegister: commercialRegister.trim() || undefined,
      taxNumber: taxNumber.trim() || undefined,
      footerNote: footerNote.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      countryId: countryId ?? undefined,
      cityId: cityId ?? undefined,
      stateId: stateId ?? undefined,
      street: street.trim() || undefined,
      buildingNumber: buildingNumber.trim() || undefined,
      subNumber: subNumber.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
    };

    try {
      if (isEditMode && branchId) {
        await updateBranch({ id: branchId, ...payload });
        notifySuccess(t("branch_updated") || "تم تعديل الفرع بنجاح");
      } else {
        await createBranch(payload);
        notifySuccess(t("branch_created") || "تم إضافة الفرع بنجاح");
      }
      navigate("/branches");
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || t("error_occurred") || "حدث خطأ أثناء الحفظ");
    }
  };

  const BackIcon = direction === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div dir={direction} className="space-y-6">
      {isLoadingDetail && branchId ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">{isViewMode ? t("view_branch") || "عرض الفرع" : isEditMode ? t("edit_branch") || "تعديل الفرع" : t("add_branch") || "إضافة فرع جديد"}</h1>
            </CardTitle>
            <CardDescription>{isViewMode ? t("branch_details") || "تفاصيل بيانات الفرع" : t("branch_form_desc") || "أدخل بيانات الفرع الخاصة بالمنشأة"}</CardDescription>
            <CardAction>
              <Button form="branchForm" size="xl" asChild>
                <Link to={"/branches"}>
                  الرجوع لقائمة الفروع
                  <ArrowLeft />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form id="branchForm" onSubmit={handleSubmit} className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>{t("basic_info") || "المعلومات الأساسية"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel>
                        {t("business_name") || "اسم النشاط"}
                        <span className="text-red-500 ">*</span>
                      </FieldLabel>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("business_name_placeholder") || "اسم الفرع / النشاط"} className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("email") || "البريد الإلكتروني"}</FieldLabel>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@example.com" className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("phone") || "رقم الجوال"}</FieldLabel>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxxxxxx" className="h-10" readOnly={isViewMode} />
                    </Field>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel className="gap-x-1">
                        {t("branch_code") || "كود الفرع"}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="BR-001" className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("tax_number") || "الرقم الضريبي"}</FieldLabel>
                      <Input value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("commercial_register") || "السجل التجاري"}</FieldLabel>
                      <Input value={commercialRegister} onChange={(e) => setCommercialRegister(e.target.value)} className="h-10" readOnly={isViewMode} />
                    </Field>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{t("company_logo") || "شعار الشركة"}</p>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => !isViewMode && fileInputRef.current?.click()}
                      className={`relative rounded-xl border-2 border-dashed transition-all flex items-center justify-center min-h-[120px] ${isViewMode ? "cursor-default" : "cursor-pointer"} ${isDragging ? "border-[#2ecc71] bg-[#2ecc71]/5 dark:bg-[#2ecc71]/10" : "border-gray-200 dark:border-zinc-800 hover:border-[#2ecc71]/50 hover:bg-gray-50 dark:hover:bg-zinc-800/20"}`}
                    >
                      {imagePreview ? (
                        <div className="relative p-3">
                          <img src={imagePreview} alt="logo" className="h-24 object-contain rounded-lg" />
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                                setImageUrl("");
                              }}
                              className="absolute -top-1 -right-1 bg-white dark:bg-zinc-900 rounded-full border border-gray-200 dark:border-zinc-800 p-0.5 shadow"
                            >
                              <X size={13} className="text-gray-500" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
                          <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900">
                            <Upload size={20} />
                          </div>
                          <p className="text-sm font-medium text-gray-600">{t("drag_drop_image") || "اسحب وأفلت الصورة هنا"}</p>
                          <p className="text-xs">{t("or_browse") || "أو اضغط للتصفح"}</p>
                          <button type="button" className="mt-1 text-xs border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 transition-colors">
                            {t("browse_files") || "تصفح الملفات"}
                          </button>
                        </div>
                      )}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageFile(f);
                        }}
                      />
                    </div>
                  </div>

                  <Field>
                    <FieldLabel>{t("invoice_footer") || "ملاحظات على الفاتورة"}</FieldLabel>
                    <textarea value={footerNote} onChange={(e) => setFooterNote(e.target.value)} placeholder={t("invoice_footer_placeholder") || "شكراً لزيارتكم..."} rows={3} readOnly={isViewMode} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] resize-none disabled:bg-gray-50" />
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {/* <MapPin size={17} className="text-[var(--primary)]" /> */}
                    {t("address_settings") || "إعدادات العنوان"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Field>
                      <FieldLabel>
                        {t("country") || "البلد"}
                        <span className="text-red-500 ms-1">*</span>
                      </FieldLabel>
                      <ComboboxField value={countryId ?? undefined} onChange={handleCountryChange} items={countries ?? []} valueKey="id" labelKey="countryName" placeholder={t("select_country")} disabled={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>
                        {t("city") || "المدينة"}
                        <span className="text-red-500 ms-1">*</span>
                      </FieldLabel>
                      <ComboboxField value={cityId ?? undefined} onChange={handleCityChange} items={cities ?? []} valueKey="id" labelKey="cityName" placeholder={!countryId ? t("select_country_first") : t("select_city")} disabled={!countryId || isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>
                        {t("district") || "الحي"}
                        <span className="text-red-500 ms-1">*</span>
                      </FieldLabel>
                      <ComboboxField value={stateId ?? undefined} onChange={(val) => setStateId(val ? Number(val) : null)} items={states ?? []} valueKey="id" labelKey="statesName" placeholder={!cityId ? t("select_city_first") : t("select_district")} disabled={!cityId || isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>
                        {t("street_name") || "اسم الشارع"}
                        <span className="text-red-500 ms-1">*</span>
                      </FieldLabel>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder={t("street_placeholder") || "الشارع"} className="h-10" readOnly={isViewMode} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel>{t("postal_code") || "الرمز البريدي"} (ex:12345)</FieldLabel>
                      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00000" className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("building_number") || "رقم المبنى"} (ex:1234)</FieldLabel>
                      <Input value={buildingNumber} onChange={(e) => setBuildingNumber(e.target.value)} placeholder="0000" className="h-10" readOnly={isViewMode} />
                    </Field>

                    <Field>
                      <FieldLabel>{t("sub_number") || "الرقم الفرعي"} (ex:1234)</FieldLabel>
                      <Input value={subNumber} onChange={(e) => setSubNumber(e.target.value)} placeholder="0000" className="h-10" readOnly={isViewMode} />
                    </Field>
                  </div>
                </CardContent>
              </Card>

              {!isViewMode && (
                <div className="flex items-center justify-end gap-3 pb-6">
                  <Button type="button" variant="outline" asChild>
                    <Link to="/branches">{t("cancel") || "إلغاء"}</Link>
                  </Button>
                  <Button size="2xl" type="submit" form="branchForm" disabled={isPending} className="min-w-[140px]">
                    {isPending && <Loader2 size={15} className="animate-spin me-1" />}
                    {isPending ? t("saving") || "جارٍ الحفظ..." : isEditMode ? t("save_changes") || "حفظ التعديلات" : t("add_branch") || "إضافة الفرع"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
