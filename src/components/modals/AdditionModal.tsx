import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserPlus } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import type { Addition, createAddition } from "@/features/Additions/types/additions.types";
import { useCreateAddition } from "@/features/Additions/hooks/useCreateAddition";
import { useUpdateAddition } from "@/features/Additions/hooks/useUpdateAddition";
import useToast from "@/hooks/useToast";

interface AdditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addition: Addition | undefined;
}

const additionSchema = (t: (key: string) => string) =>
  z.object({
    additionNameAr: z.string().min(3, t("validation_name_min_3")),
    additionNameEn: z.string().optional(),
    additionNameUr: z.string().optional(),
  });

export default function AdditionModal({ isOpen, onClose, addition }: AdditionModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: createAddition } = useCreateAddition();
  const { mutateAsync: updateAddition } = useUpdateAddition();
  const { notifySuccess, notifyError } = useToast();

  const schema = additionSchema(t);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      additionNameAr: "",
      additionNameEn: "",
      additionNameUr: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (addition) {
      form.reset({
        additionNameAr: addition.additionNameAr ?? "",
        additionNameEn: addition.additionNameEn ?? "",
        // additionNameUr: addition.additionNameUr ?? "",
      });
    } else {
      form.reset({
        additionNameAr: "",
        additionNameEn: "",
        additionNameUr: "",
      });
    }
  }, [addition, isOpen, form]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const payload: createAddition = {
        additionNameAr: data.additionNameAr,
        additionNameEn: data.additionNameEn || "",
        additionNameUr: data.additionNameUr || "",
      };

      if (!addition) {
        await createAddition(payload);
      } else {
        await updateAddition({ id: addition.id, data: payload });
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
            {addition?.id ? t("edit_addition") : t("add_new_addition")}
          </DialogTitle>
        </DialogHeader>

        <form id="additionForm" onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
            <Controller
              name="additionNameAr"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {t("addition_name_ar")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} placeholder={t("enter_addition_name_ar")} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="additionNameEn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("addition_name_en")}</FieldLabel>
                  <Input {...field} placeholder={t("enter_addition_name_en")} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="additionNameUr"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("addition_name_ur")}</FieldLabel>
                  <Input {...field} placeholder={t("enter_addition_name_ur")} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button form="additionForm" className="h-12 px-6 text-base" type="submit">
            {addition?.id ? t("edit_addition") : t("add_new_addition")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
