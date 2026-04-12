import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Truck, Wallet } from "lucide-react";
import ComboboxField from "@/components/ui/ComboboxField";
import { useLanguage } from "@/context/LanguageContext";
import useToast from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

import { useGetAllTreasurys } from "@/features/treasurys/hooks/useGetAllTreasurys";
import { useGetAllSuppliers } from "@/features/suppliers/hooks/useGetAllSuppliers";
import { useCreateSupplierTransaction } from "@/features/supplier-transactions/hooks/useCreateSupplierTransaction";
import { useUpdateSupplierTransaction } from "@/features/supplier-transactions/hooks/useUpdateSupplierTransaction";
import type { SupplierTransaction } from "@/features/supplier-transactions/types/supplierTransactions.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  editData?: SupplierTransaction | null;
};

const DEFAULT_TRANSACTION_TYPE = "PurchaseInvoice";

export default function AddSupplierPaymentModal({ isOpen, onClose, mode = "add", editData = null }: Props) {
  const { direction, t } = useLanguage();
  const { notifyError, notifySuccess } = useToast();

  const { data: treasurys } = useGetAllTreasurys();
  const { data: suppliersResponse } = useGetAllSuppliers();
  const suppliers = Array.isArray(suppliersResponse?.items) ? suppliersResponse.items : Array.isArray(suppliersResponse) ? suppliersResponse : [];

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateSupplierTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateSupplierTransaction();

  const isEditMode = mode === "edit";
  const isPending = isCreating || isUpdating;

  const [transactionDate, setTransactionDate] = useState("");
  const [treasuryId, setTreasuryId] = useState<number | undefined>();
  const [supplierId, setSupplierId] = useState<number | undefined>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editData) {
      setTransactionDate(editData.transactionDate ? new Date(editData.transactionDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
      setTreasuryId(editData.treasuryId);
      setSupplierId(editData.supplierId);
      setAmount(String(editData.amount ?? ""));
      setDescription(editData.description ?? "");
      return;
    }

    setTransactionDate(new Date().toISOString().slice(0, 10));
    setTreasuryId(undefined);
    setSupplierId(undefined);
    setAmount("");
    setDescription("");
  }, [isOpen, isEditMode, editData]);

  const selectedSupplier = useMemo(() => suppliers?.find((s: any) => s.id === supplierId), [suppliers, supplierId]);
  const currentBalance = Number(selectedSupplier?.balance ?? 0);
  const amountNumber = Number(amount || 0);
  const balanceAfter = currentBalance - amountNumber;

  const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString("en-US");

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionDate) {
      notifyError(t("date_required"));
      return;
    }

    if (!treasuryId) {
      notifyError(t("select_treasury"));
      return;
    }

    if (!supplierId) {
      notifyError(t("select_supplier"));
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      notifyError(t("valid_amount_required"));
      return;
    }

    try {
      if (isEditMode && editData) {
        await updateTransaction({
          id: editData.id,
          supplierId,
          treasuryId,
          transactionType: editData.transactionType || DEFAULT_TRANSACTION_TYPE,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

        notifySuccess(t("edit_supplier_payment_success"));
      } else {
        await createTransaction({
          supplierId,
          treasuryId,
          transactionType: DEFAULT_TRANSACTION_TYPE,
          transactionDate: new Date(transactionDate).toISOString(),
          amount: parsedAmount,
          description: description.trim() || "",
        });

        notifySuccess(t("add_supplier_payment_success"));
      }

      handleClose();
    } catch (error: any) {
      notifyError(error?.response?.data?.message || error?.message || t("save_error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="w-full sm:max-w-[720px] p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-5 py-2 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71] text-lg font-semibold flex-wrap">
            {isEditMode ? <Pencil size={18} /> : <Truck size={18} />}
            {isEditMode ? t("edit_supplier_payment") : t("add_supplier_payment")}
          </DialogTitle>
        </DialogHeader>

        <form id="supplierPaymentForm" onSubmit={handleSubmit} className="px-5 space-y-3">
          <Field>
            <FieldLabel>{t("date")}</FieldLabel>
            <Input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="h-9" />
          </Field>

          <div className="rounded-2xl border border-gray-200  p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">{t("treasury")}</h3>
            </div>

            <ComboboxField
              value={treasuryId}
              onChange={(val) => setTreasuryId(val ? Number(val) : undefined)}
              items={treasurys ?? []}
              valueKey="id"
              labelKey="name"
              placeholder={t("select_treasury")}
            />
          </div>

          <div className="rounded-2xl border border-gray-200  p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#2ecc71]" />
              <h3 className="text-sm font-semibold text-gray-800">{t("account_name")}</h3>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field>
                <FieldLabel>{t("supplier_name")}</FieldLabel>
                <ComboboxField
                  value={supplierId}
                  onChange={(val) => setSupplierId(val ? Number(val) : undefined)}
                  items={suppliers ?? []}
                  valueKey="id"
                  labelKey="supplierName"
                  placeholder={t("select_supplier")}
                  disabled={isEditMode}
                />
              </Field>

              <Field>
                <FieldLabel>{t("current_balance")}</FieldLabel>
                <Input readOnly value={formatNumber(currentBalance)} className="h-9 bg-gray-50 text-center" />
              </Field>
            </div>
          </div>

          <Field>
            <FieldLabel>{t("amount")}</FieldLabel>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="h-9" />
          </Field>

          <Field>
            <FieldLabel>{t("balance_after")}</FieldLabel>
            <Input readOnly value={formatNumber(balanceAfter)} className="h-9 bg-gray-50 text-center text-[#2ecc71] font-semibold" />
          </Field>

          <Field>
            <FieldLabel>{t("statement")}</FieldLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("supplier_payment_statement_placeholder")} className="h-9" />
          </Field>
        </form>

        <DialogFooter className="px-5 py-7 border-t border-gray-100">
          <div className="flex justify-end gap-3 w-full px-2">
            <Button type="button" variant="outline" onClick={handleClose} className="h-10 px-6">
              {t("cancel")}
            </Button>

            <Button form="supplierPaymentForm" type="submit" disabled={isPending} className="min-w-[150px] h-10 px-6">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? (isEditMode ? t("updating") : t("saving")) : isEditMode ? t("save_changes") : t("save_supplier_payment")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
