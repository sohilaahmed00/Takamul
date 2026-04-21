import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Barcode, UserPlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import z from "zod/v3";
import { CreateGiftCardPayload, GiftCard, UpdateGiftCardPayload } from "@/features/gift-cards/types/giftCard.types";
import { useCreateGiftCard } from "@/features/gift-cards/hooks/useCreateGiftCard";
import { useGetAllCustomers } from "@/features/customers/hooks/useGetAllCustomers";
import { useUpdateGiftCard } from "@/features/gift-cards/hooks/useUpdateGiftCard";

interface AddGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard?: GiftCard;
}

export const createGiftCardSchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(1, "الكود مطلوب"),
    amount: z.number().min(1, "المبلغ مطلوب"),
    expiryDate: z.string().min(1, t("date_required")),
    customerId: z.number().nullable().optional(),
    notes: z.string().optional().or(z.literal("")),
  });

export default function AddGiftCardModal({ isOpen, onClose, giftCard }: AddGiftCardModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: createGiftCard, isPending: createPending } = useCreateGiftCard();
  const { mutateAsync: updateGiftCard, isPending: updatePeding } = useUpdateGiftCard();
  const isLoading = createPending || updatePeding;
  const { data: customers } = useGetAllCustomers();
  function generateRandomCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  const schema = createGiftCardSchema(t);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      amount: undefined as unknown as number,
      expiryDate: "",
      customerId: null,
      notes: "",
    },
  });
  const { control, watch, setValue, reset } = form;

  useEffect(() => {
    if (customers?.items?.length > 0 && !giftCard) {
      setValue("customerId", customers.items[0].id);
    }
  }, [customers]);

  useEffect(() => {
    if (!isOpen) return;
    if (giftCard) {
      form.reset({
        code: giftCard.code,
        amount: giftCard.initialAmount,
        expiryDate: giftCard.expiryDate?.split("T")[0],
        notes: giftCard.notes,
        customerId: giftCard?.customerId,
      });
    } else {
      form.reset({
        code: "",
        amount: undefined as unknown as number,
        expiryDate: "",
        customerId: null,
        notes: "",
      });
    }
  }, [giftCard, isOpen, form]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      console.log("first");
      let payload: CreateGiftCardPayload | UpdateGiftCardPayload;

      if (giftCard) {
        payload = {
          id: giftCard?.id,
          code: data.code,
          initialAmount: data.amount,
          customerId: data.customerId,
          expiryDate: data?.expiryDate,
          notes: data.notes,
        };
        updateGiftCard(payload);
      } else {
        payload = {
          code: data.code,
          amount: data.amount,
          customerId: data.customerId,
          expiryDate: data?.expiryDate,
          notes: data.notes,
        };
        await createGiftCard(payload);
      }
      form.reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
            <UserPlus size={20} />
            إضافة كارت هدايا
          </DialogTitle>
        </DialogHeader>

        <form id="addPartnerForm" onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    الكود <span className="text-red-500">*</span>
                  </FieldLabel>
                  <div className="flex gap-2">
                    <Input {...field} placeholder={"ادخل الكود"} />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xl"
                      className="shrink-0 px-3"
                      onClick={() =>
                        setValue("code", generateRandomCode(), {
                          shouldValidate: true,
                        })
                      }
                    >
                      <Barcode size={16} />
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="customerId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>العميل</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"اختر العميل"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {customers?.items?.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.customerName}
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
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>المبلغ *</FieldLabel>
                  <Input {...field} type="number" onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} placeholder={"ادخل المبلغ"} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="expiryDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {" "}
                    تاريخ الصلاحية <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} type="date" placeholder={"ادخل تاريخ الصلاحية"} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button loading={isLoading} form="addPartnerForm" className="h-12 px-6 text-base" type="submit">
            حفظ البيانات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
