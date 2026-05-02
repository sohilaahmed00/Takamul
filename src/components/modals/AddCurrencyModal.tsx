import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useLanguage } from "@/context/LanguageContext";
import { Currency, CreateCurrency } from "@/features/currencies/types/currencies.types";
import { useAddCurrency } from "@/features/currencies/hooks/useAddCurrency";
import { useUpdateCurrency } from "@/features/currencies/hooks/useUpdateCurrency";
import { Switch } from "@/components/ui/switch";

interface AddCurrencyModalProps {
  currency?: Currency;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCurrencyModal({ currency, isOpen, onClose }: AddCurrencyModalProps) {
  const { t, direction } = useLanguage();
  const { mutate: addCurrency, isPending: isAdding } = useAddCurrency();
  const { mutate: updateCurrency, isPending: isUpdating } = useUpdateCurrency();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCurrency>({
    defaultValues: {
      name: "",
      code: "",
      symbol: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (currency) {
      reset({
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
        isDefault: currency.isDefault,
      });
    } else {
      reset({
        name: "",
        code: "",
        symbol: "",
        isDefault: false,
      });
    }
  }, [currency, reset, isOpen]);

  const onSubmit = (data: CreateCurrency) => {
    if (currency) {
      updateCurrency(
        { id: currency.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
    } else {
      addCurrency(data, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  const isDefault = watch("isDefault");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={direction}>
        <DialogHeader>
          <DialogTitle>{currency ? t("edit_currency") : t("add_currency")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel>{t("currency_name")} *</FieldLabel>
            <Input {...register("name", { required: true })} placeholder={t("currency_name")} />
            {errors.name && <span className="text-red-500 text-xs">{t("required_field")}</span>}
          </Field>
          <Field>
            <FieldLabel>{t("currency_code")} *</FieldLabel>
            <Input {...register("code", { required: true })} placeholder={t("currency_code")} />
            {errors.code && <span className="text-red-500 text-xs">{t("required_field")}</span>}
          </Field>
          <Field>
            <FieldLabel>{t("currency_symbol")} *</FieldLabel>
            <Input {...register("symbol", { required: true })} placeholder={t("currency_symbol")} />
            {errors.symbol && <span className="text-red-500 text-xs">{t("required_field")}</span>}
          </Field>
          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <FieldLabel className="mb-0 cursor-pointer" htmlFor="is-default-switch">
              {t("set_as_default_currency") || "تعيين كعملة افتراضية"}
            </FieldLabel>
            <Switch
              id="is-default-switch"
              checked={isDefault}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isAdding || isUpdating}>
            {currency ? t("save_changes") : t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
