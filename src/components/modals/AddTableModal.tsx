import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { LayoutGrid } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { useAddTable } from "@/features/tables/hooks/useAddTable";
import { useUpdateTable } from "@/features/tables/hooks/useUpdateTable";
import { Table } from "@/features/tables/types/tables.types";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: Table;
}

const createTableSchema = (t: (key: string) => string) =>
  z.object({
    tableName: z.string().min(1, t("validation_name_required")),
  });

export default function AddTableModal({ isOpen, onClose, table }: AddTableModalProps) {
  const { t, direction } = useLanguage();
  const { mutateAsync: addTable } = useAddTable();
  const { mutateAsync: updateTable } = useUpdateTable();

  const schema = useMemo(() => createTableSchema(t), [t]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tableName: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (table) {
      form.reset({ tableName: table.tableName });
    } else {
      form.reset({ tableName: "" });
    }
  }, [table, isOpen]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (table) {
        await updateTable({ id: table.id, data: { tableName: data.tableName } });
      } else {
        await addTable({ tableName: data.tableName });
      }
      form.reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[400px]">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
            <LayoutGrid size={20} />
            {table ? t("edit_table") : t("add_table")}
          </DialogTitle>
        </DialogHeader>

        <form id="addTableForm" onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <Controller
            name="tableName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  اسم الطاولة <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder={"ادخل اسم الطاولة"} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <Button size="2xl" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button size="2xl" form="addTableForm" className="" type="submit">
            {table ? t("edit_table") : t("add_table")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
