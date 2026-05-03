import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Lock, X } from "lucide-react";
import { printShiftReport, ShiftReportData } from "../orders/printShiftReport";
import { cn } from "@/lib/utils";

interface ShiftReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShiftReportData;
  onConfirmCloseShift: () => void;
}

export default function ShiftReportModal({ isOpen, onClose, data, onConfirmCloseShift }: ShiftReportModalProps) {
  const fmt = (n: number | undefined | null) => (typeof n === "number" && !isNaN(n) ? n.toFixed(2) : "00.00");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false} className="max-w-[500px] p-0 overflow-hidden bg-[#f8fafc] dark:bg-slate-900 border-none shadow-2xl rounded-3xl">
        {/* Top Header Area */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-20">
<<<<<<< HEAD
          <Button 
            onClick={() => printShiftReport(data)}
            className="bg-[#000052] hover:bg-[#000052]/90 text-white font-medium h-9 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 text-xs"
          >
=======
          <Button onClick={() => printShiftReport(data)} className="bg-[#000052] hover:bg-[#000052]/90 text-white font-bold h-9 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-xs">
>>>>>>> a434d2428aa4316d5e306ff4a63227d2e4d854a6
            <Printer size={14} />
            طباعة
          </Button>

          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <Button 
              onClick={onConfirmCloseShift}
              className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium h-9 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 text-xs"
            >
=======
            <Button onClick={onConfirmCloseShift} className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold h-9 px-4 rounded-xl  flex items-center gap-2 transition-all active:scale-95 text-xs">
>>>>>>> a434d2428aa4316d5e306ff4a63227d2e4d854a6
              <Lock size={14} />
              غلق الوردية
            </Button>

            <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all text-slate-500">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Report Preview Area */}
        <div className="p-6 overflow-y-auto max-h-[80vh] flex flex-col items-center gap-4 bg-[#f1f5f9]">
<<<<<<< HEAD
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 w-full max-w-[380px] text-right rounded-xl" style={{ direction: 'rtl', fontFamily: 'Cairo, Tahoma, Arial, sans-serif' }}>
=======
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 w-full max-w-[380px] text-right rounded-xl" style={{ direction: "rtl", fontFamily: "Tahoma, Arial, sans-serif" }}>
>>>>>>> a434d2428aa4316d5e306ff4a63227d2e4d854a6
            {/* TOP BOX */}
            <div className="border-[2px] border-black mb-4 overflow-hidden rounded-sm">
              <div className="flex justify-between p-3 border-b-[2px] border-black">
                <div className="flex flex-col items-start w-1/2">
                  <span className="text-[7.5pt] font-medium text-gray-400">اسم المستخدم</span>
                  <span className="text-[9.5pt] font-medium leading-tight">{data.userName}</span>
                </div>
                <div className="flex flex-col items-end w-1/2">
                  <span className="text-[7.5pt] font-medium text-gray-400">رقم الوردية</span>
                  <span className="text-[9.5pt] font-medium leading-tight">{data.shiftNumber}</span>
                </div>
              </div>
              <div className="text-center p-2.5 border-b-[2px] border-black bg-slate-50/50">
                <div className="text-[7.5pt] font-medium text-gray-400">تاريخ الوردية</div>
                <div className="text-[11pt] font-medium">{data.shiftDate}</div>
              </div>
              <div className="flex justify-between p-3">
                <div className="flex flex-col items-start w-1/2">
                  <span className="text-[7.5pt] font-medium text-gray-400">من الساعه</span>
                  <span className="text-[9.5pt] font-medium leading-tight">{data.fromTime}</span>
                </div>
                <div className="flex flex-col items-end w-1/2">
                  <span className="text-[7.5pt] font-medium text-gray-400">إلى الساعه</span>
                  <span className="text-[9.5pt] font-medium leading-tight">{data.toTime}</span>
                </div>
              </div>
            </div>

            {/* بيان الوردية */}
            <div className="mb-4 w-full text-center">
              <div className="relative z-10">
                <span className="inline-block border-[2px] border-black px-6 py-1 text-[10pt] font-bold bg-white uppercase">بيان الوردية</span>
              </div>
              <div className="border-[1.5px] border-black">
                <table className="w-full border-collapse text-[8pt] font-medium">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold w-[10%]">م</th>
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold w-[35%]">الصنف</th>
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold">السعر</th>
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold">الكمية</th>
                      <th className="border-b-[1.5px] border-black p-1.5 text-center font-bold">الاجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border-b border-l border-slate-300 p-1.5 text-center">.{idx + 1}</td>
                        <td className="border-b border-l border-slate-300 p-1.5 text-center">{item.productName}</td>
                        <td className="border-b border-l border-slate-300 p-1.5 text-center font-bold">{fmt(item.price)}</td>
                        <td className="border-b border-l border-slate-300 p-1.5 text-center font-bold">{fmt(item.quantity)}</td>
                        <td className="border-b border-slate-300 p-1.5 text-center font-bold">{fmt(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTALS */}
            <div className="border-[1.5px] border-black mb-3 p-3 bg-slate-50/30">
              <div className="flex justify-between py-1.5 text-[8.5pt] font-medium">
                <span className="font-bold text-[9.5pt]">{fmt(data.totalBeforeTax)}</span>
                <span className="text-gray-600">الاجمالي بدون الضريبة</span>
              </div>
              <div className="flex justify-between py-1.5 text-[8.5pt] font-medium">
                <span className="font-bold text-[9.5pt]">{fmt(data.totalTax)}</span>
                <span className="text-gray-600">إجمالي الضريبة</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t-[1.5px] border-black text-[10pt] font-bold">
                <span className="text-[11pt]">{fmt(data.grandTotal)}</span>
                <span>الاجمالي النهائي</span>
              </div>
            </div>

            {/* يومية الخزائن */}
            <div className="mb-3 w-full text-center">
              <div className="relative z-10">
                <span className="inline-block border-[1.5px] border-black px-5 py-1 text-[9pt] font-bold bg-white uppercase">يومية الخزائن</span>
              </div>
              <div className="border-[1.5px] border-black overflow-hidden">
                <table className="w-full border-collapse text-[8.5pt] font-medium">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold">كاش</th>
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold">شبكة</th>
                      <th className="border-b-[1.5px] border-black p-1.5 text-center font-bold">شركات توصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-l-[1.5px] border-black p-2 text-center font-bold text-blue-700">{fmt(data.payment.cash)}</td>
                      <td className="border-l-[1.5px] border-black p-2 text-center font-bold text-blue-700">{fmt(data.payment.network)}</td>
                      <td className="p-2 text-center font-bold text-blue-700">{fmt(data.payment.delivery)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* المشتريات و المصروفات */}
            <div className="mb-3 mt-5 w-full text-center">
              <div className="relative z-10">
                <span className="inline-block border-[1.5px] border-black px-5 py-1 text-[9pt] font-bold bg-white uppercase">المشتريات و المصروفات</span>
              </div>
              <div className="border-[1.5px] border-black overflow-hidden">
                <table className="w-full border-collapse text-[8.5pt] font-medium">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border-b-[1.5px] border-l-[1.5px] border-black p-1.5 text-center font-bold">إجمالي المشتريات</th>
                      <th className="border-b-[1.5px] border-black p-1.5 text-center font-bold">اجمالي المصروفات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-l-[1.5px] border-black p-2 text-center font-bold text-red-600">{fmt(data.totalPurchases)}</td>
                      <td className="p-2 text-center font-bold text-red-600">{fmt(data.totalExpenses)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="mb-2 mt-5 w-full text-center">
              <div className="relative z-10">
                <span className="inline-block border-[1.5px] border-black px-5 py-1 text-[9pt] font-bold bg-white uppercase">شركات التوصيل</span>
              </div>
              <div className="border-[1.5px] border-black overflow-hidden w-full">
                <table className="w-full border-collapse text-[8.5pt] font-medium">
                  <tbody>
                    {data.deliveryCompanies.map((c, idx) => (
                      <tr key={idx} className={cn(idx % 2 === 0 ? "bg-white" : "bg-slate-50/50")}>
                        <td className="p-2 text-center border-b border-slate-100 text-gray-700 font-medium border-l-[1.5px] border-black w-1/2">{c.name}</td>
                        <td className="p-2 text-center w-1/2 font-bold border-b border-slate-100">{fmt(c.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium italic mt-2">معاينة التقرير الحراري قبل الطباعة</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
