import { useState } from "react";
import { PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HoldModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (note: string) => void;
}

export default function HoldModal({ open, onClose, onConfirm }: HoldModalProps) {
  const [note, setNote] = useState("");
  const handleConfirm = () => {
    onConfirm(note || "No note");
    setNote("");
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-xs ">
        <DialogHeader className="py-3">
          <DialogTitle className="flex items-center gap-2 ">
            <PauseCircle size={20} className="text-primary" />
            فاتورة معلقة
          </DialogTitle>
        </DialogHeader>

        <div className=" flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground">ملاحظات</label>
            <Input autoFocus value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleConfirm()} placeholder="ادخل ملاحظات الفاتورة المعلقة" className="" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="outline" size="2xl" onClick={handleClose}>
              إلغاء
            </Button>
            <Button size="2xl" onClick={handleConfirm}>
              تعليق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
