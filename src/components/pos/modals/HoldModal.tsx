import { useState } from "react";

import { Input } from "@/components/ui/input";

interface HoldModalProps {
  onClose: () => void;
  onConfirm: (note: string) => void;
}

export default function HoldModal({ onClose, onConfirm }: HoldModalProps) {
  const [note, setNote] = useState("");

  return (
    <div className="absolute inset-0 bg-black/35 flex items-center justify-center z-50 rounded-xl">
      <div className="bg-white rounded-2xl p-6 w-72 border-2 border-dashed border-primary/40">
        <div className="text-base font-black text-gray-800 mb-4">⏸ Hold Cart</div>
        <div className="text-xs text-gray-400 mb-1">Cart Note</div>
        <Input autoFocus value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary/50 mb-4" placeholder="Enter the note for holding cart" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(note || "No note")} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
