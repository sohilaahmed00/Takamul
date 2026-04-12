import React, { useCallback, useEffect, useRef, useState } from "react";
import { Building2, Loader2, Pencil, Upload, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Combobox, ComboboxContent, ComboboxEmpty,
  ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox";

import { useGetCountries } from "@/features/Location/hooks/Usegetcountries";
import { useGetCities } from "@/features/Location/hooks/Usegetcities";
import { useGetStates } from "@/features/Location/hooks/Usegetstates";
import { useCreateBranch } from "@/features/Branches/hooks/Usecreatebranch";
import { useUpdateBranch } from "@/features/Branches/hooks/Useupdatebranch";
import { useGetBranchById } from "@/features/Branches/hooks/Usegetbranchbyid";
import type { BranchListItem } from "@/features/Branches/types/Branches.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: BranchListItem | null;
};

export default function AddBranchModal({ isOpen, onClose, mode = "add", editData = null }: Props) {
  const { direction } = useLanguage();
  const { notifyError, notifySuccess } = useToast();
  const isEditMode = mode === "edit";

  // fetch full branch data in edit mode
  const { data: branchDetail, isLoading: isLoadingDetail } = useGetBranchById(
    isEditMode && editData ? editData.id : undefined
  );

  const { mutateAsync: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdating } = useUpdateBranch();
  const isPending = isCreating || isUpdating;

  // form fields
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

  // address
  const [countryId, setCountryId] = useState<number | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [cityId, setCityId] = useState<number | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [stateId, setStateId] = useState<number | null>(null);
  const [stateSearch, setStateSearch] = useState("");
  const [street, setStreet] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [subNumber, setSubNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // location data
  const { data: countries } = useGetCountries();
  const { data: cities } = useGetCities(countryId);
  const { data: states } = useGetStates(cityId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // reset on open
  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode && branchDetail) {
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
      return;
    }
    if (!isEditMode) {
      setCode(""); setName(""); setBusinessName(""); setEmail(""); setPhone("");
      setTaxNumber(""); setCommercialRegister(""); setFooterNote("");
      setImageUrl(""); setImagePreview(null);
      setCountryId(null); setCityId(null); setStateId(null);
      setCountrySearch(""); setCitySearch(""); setStateSearch("");
      setStreet(""); setBuildingNumber(""); setSubNumber(""); setPostalCode("");
    }
  }, [isOpen, isEditMode, branchDetail]);

  // sync combobox labels
  useEffect(() => {
    const c = (countries ?? []).find((c) => c.id === countryId);
    setCountrySearch(c?.countryName ?? "");
  }, [countryId, countries]);

  useEffect(() => {
    const c = (cities ?? []).find((c) => c.id === cityId);
    setCitySearch(c?.cityName ?? "");
  }, [cityId, cities]);

  useEffect(() => {
    const s = (states ?? []).find((s) => s.id === stateId);
    setStateSearch(s?.statesName ?? "");
  }, [stateId, states]);

  // reset city/state when country changes
  const handleCountryChange = (val: string | null) => {
    setCountryId(val ? Number(val) : null);
    setCityId(null); setStateId(null);
    setCitySearch(""); setStateSearch("");
  };

  const handleCityChange = (val: string | null) => {
    setCityId(val ? Number(val) : null);
    setStateId(null); setStateSearch("");
  };

  // image handling
  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { notifyError("يرجى اختيار ملف صورة"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageUrl(result); // In production: upload to server and use returned URL
    };
    reader.readAsDataURL(file);
  }, [notifyError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, [handleImageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { notifyError("كود الفرع مطلوب"); return; }
    if (!name.trim()) { notifyError("اسم الفرع مطلوب"); return; }

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
      if (isEditMode && editData) {
        await updateBranch({ id: editData.id, ...payload });
        notifySuccess("تم تعديل الفرع بنجاح");
      } else {
        await createBranch(payload);
        notifySuccess("تم إضافة الفرع بنجاح");
      }
      onClose();
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { (document.activeElement as HTMLElement)?.blur(); onClose(); } }}>
      <DialogContent
        dir={direction}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-full sm:max-w-[860px] p-0 overflow-hidden rounded-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-3 border-b border-gray-100 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-base font-semibold">
            {isEditMode ? <Pencil size={17} /> : <Building2 size={17} />}
            {isEditMode ? "تعديل فرع" : "إضافة فرع"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {isEditMode ? "تعديل بيانات الفرع" : "إضافة فرع جديد للمنشأة"}
          </DialogDescription>
        </DialogHeader>

        {/* Body — scrollable */}
        <form id="branchForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {isEditMode && isLoadingDetail ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-[var(--primary)]" size={28} />
            </div>
          ) : (
            <>
              {/* شعار الشركة — drag & drop */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">شعار الشركة</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors
                    ${isDragging ? "border-[#2ecc71] bg-[#2ecc71]/5" : "border-gray-200 hover:border-[#2ecc71]/50 hover:bg-gray-50"}
                    flex items-center justify-center min-h-[110px]`}
                >
                  {imagePreview ? (
                    <div className="relative p-2">
                      <img src={imagePreview} alt="preview" className="h-20 object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageUrl(""); }}
                        className="absolute -top-1 -right-1 bg-white rounded-full border border-gray-200 p-0.5 shadow"
                      >
                        <X size={12} className="text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                        <Upload size={18} />
                      </div>
                      <p className="text-sm font-medium text-gray-600">اسحب وأفلت الصورة هنا</p>
                      <p className="text-xs text-gray-400">أو اضغط للتصفح</p>
                      <button type="button" className="mt-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 text-gray-600">تصفح الملفات</button>
                    </div>
                  )}
                  <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
                </div>
              </div>

              {/* Row 1: اسم النشاط / البريد / الهاتف */}
              <div className="grid grid-cols-3 gap-3">
                <Field>
                  <FieldLabel>اسم النشاط <span className="text-red-500">*</span></FieldLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الفرع" className="h-10" />
                </Field>
                <Field>
                  <FieldLabel>البريد الإلكتروني</FieldLabel>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@example.com" className="h-10" />
                </Field>
                <Field>
                  <FieldLabel>هاتف</FieldLabel>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="h-10" />
                </Field>
              </div>

              {/* Row 2: كود / السجل التجاري / المعرف الإضافي / قيمة */}
              <div className="grid grid-cols-4 gap-3">
                <Field>
                  <FieldLabel>كود الفرع <span className="text-red-500">*</span></FieldLabel>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="BR-001" className="h-10" />
                </Field>
                <Field>
                  <FieldLabel>السجل التجاري</FieldLabel>
                  <Input value={commercialRegister} onChange={(e) => setCommercialRegister(e.target.value)} className="h-10" />
                </Field>
                <Field>
                  <FieldLabel>المعرف الإضافي</FieldLabel>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-10" />
                </Field>
                <Field>
                  <FieldLabel>الرقم الضريبي</FieldLabel>
                  <Input value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} className="h-10" />
                </Field>
              </div>

              {/* ملاحظات على الفاتورة */}
              <Field>
                <FieldLabel>ملاحظات على الفاتورة</FieldLabel>
                <textarea
                  value={footerNote}
                  onChange={(e) => setFooterNote(e.target.value)}
                  placeholder="شكراً لزيارتكم..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#2ecc71] resize-none"
                />
              </Field>

              {/* إعدادات العنوان */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-700">إعدادات العنوان</p>

                <div className="grid grid-cols-4 gap-3">
                  {/* البلد */}
                  <Field>
                    <FieldLabel>بلد <span className="text-red-500">*</span></FieldLabel>
                    <Combobox value={countryId?.toString() ?? ""} onValueChange={handleCountryChange} items={countries ?? []}>
                      <ComboboxInput placeholder="اختر البلد" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} showClear={!!countryId} />
                      <ComboboxContent>
                        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
                        <ComboboxList>
                          {(item: any) => <ComboboxItem key={item.id} value={item.id.toString()}>{item.countryName}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>

                  {/* المدينة */}
                  <Field>
                    <FieldLabel>المدينة <span className="text-red-500">*</span></FieldLabel>
                    <Combobox value={cityId?.toString() ?? ""} onValueChange={handleCityChange} items={cities ?? []} disabled={!countryId}>
                      <ComboboxInput placeholder={countryId ? "اختر المدينة" : "اختر البلد أولاً"} value={citySearch} onChange={(e) => setCitySearch(e.target.value)} showClear={!!cityId} disabled={!countryId} className={!countryId ? "opacity-60 cursor-not-allowed" : ""} />
                      <ComboboxContent>
                        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
                        <ComboboxList>
                          {(item: any) => <ComboboxItem key={item.id} value={item.id.toString()}>{item.cityName}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>

                  {/* الحي */}
                  <Field>
                    <FieldLabel>الحي <span className="text-red-500">*</span></FieldLabel>
                    <Combobox value={stateId?.toString() ?? ""} onValueChange={(val) => setStateId(val ? Number(val) : null)} items={states ?? []} disabled={!cityId}>
                      <ComboboxInput placeholder={cityId ? "اختر الحي" : "اختر المدينة أولاً"} value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} showClear={!!stateId} disabled={!cityId} className={!cityId ? "opacity-60 cursor-not-allowed" : ""} />
                      <ComboboxContent>
                        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
                        <ComboboxList>
                          {(item: any) => <ComboboxItem key={item.id} value={item.id.toString()}>{item.stateName}</ComboboxItem>}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </Field>

                  {/* اسم الشارع */}
                  <Field>
                    <FieldLabel>اسم الشارع <span className="text-red-500">*</span></FieldLabel>
                    <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="الشارع" className="h-10" />
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel>الرمز البريدي (ex:12345)</FieldLabel>
                    <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00000" className="h-10" />
                  </Field>
                  <Field>
                    <FieldLabel>رقم المبنى (ex:1234)</FieldLabel>
                    <Input value={buildingNumber} onChange={(e) => setBuildingNumber(e.target.value)} placeholder="0000" className="h-10" />
                  </Field>
                  <Field>
                    <FieldLabel>الرقم الفرعي (ex:1234)</FieldLabel>
                    <Input value={subNumber} onChange={(e) => setSubNumber(e.target.value)} placeholder="0000" className="h-10" />
                  </Field>
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer — fixed at bottom */}
        <DialogFooter className="px-6 py-3 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 px-6">إلغاء</Button>
            <Button form="branchForm" type="submit" disabled={isPending} className="min-w-[140px] h-10 px-6">
              {isPending && <Loader2 size={15} className="animate-spin mr-1" />}
              {isPending ? "جارٍ الحفظ..." : isEditMode ? "حفظ التعديلات" : "إضافة الفرع"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}