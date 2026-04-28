// features/partners/components/AddPartnerModal.tsx
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/features/customers/types/customers.types";
import type { Supplier } from "@/features/suppliers/types/suppliers.types";
import { PartnerBasicFields } from "@/features/partners/components/PartnerBasicFields";
import { NationalAddressSection } from "@/features/partners/components/NationalAddressSection";
import { LocationFields } from "@/features/partners/components/LocationFields";
import { usePartnerForm } from "@/features/partners/hooks/usePartnerForm";

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: Customer | Supplier;
  type?: "supplier" | "customer";
}

export default function AddPartnerModal({ isOpen, onClose, partner, type = "customer" }: AddPartnerModalProps) {
  const { t, direction } = useLanguage();
  const { form, isTaxable, isSupplier, countriesData, citiesData, statesData, onSubmit } = usePartnerForm({ isOpen, onClose, partner, type });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={direction} className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-screen-sm">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 text-[#2ecc71]">
            <UserPlus size={20} />
            {partner ? (isSupplier ? t("edit_supplier") : t("edit_customer")) : isSupplier ? t("add_supplier") : t("add_customer")}
          </DialogTitle>
        </DialogHeader>

        <form id="addPartnerForm" onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
            <PartnerBasicFields control={form.control} isSupplier={isSupplier} countriesData={countriesData ?? []} citiesData={citiesData ?? []} statesData={statesData ?? []} setValue={form.setValue} />

            <NationalAddressSection control={form.control} isTaxable={isTaxable} />

            {isTaxable && <LocationFields control={form.control} setValue={form.setValue} />}
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
