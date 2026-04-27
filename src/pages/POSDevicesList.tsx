import React, { useMemo, useState } from "react";
import { Search, Plus, Settings, Edit2, Trash2, KeyRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllPOSDevices } from "@/features/pos/hooks/useGetAllPOSDevices";
import { POSDevice } from "@/features/pos/types/pos.types";
import AddPOSDeviceModal from "@/components/modals/AddPOSDeviceModal";
import { useDeleteDevicePOS } from "@/features/pos/hooks/useDeleteDevicePOS";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// import { useGetPOSDeviceById } from "@/features/pos/hooks/useGetPOSDeviceById";
// import AddPOSDeviceModal from "@/components/modals/AddPOSDeviceModal";

// ─── Badge: البيئة ────────────────────────────────────────────────────────────

function DeleteDeviceButton({ device, onDelete, setHiddenIds }: { device: POSDevice; onDelete: (id: number) => Promise<unknown>; setHiddenIds: React.Dispatch<React.SetStateAction<Set<number>>> }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="btn-minimal-action" title="حذف">
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-[Cairo] border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-main)] rounded-2xl shadow-xl p-0 overflow-hidden max-w-md" dir="rtl">
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <Trash2 size={26} className="text-red-500" />
          </div>
          <AlertDialogTitle className="font-[Cairo] text-lg font-semibold text-[var(--text-main)] text-center">تأكيد الحذف</AlertDialogTitle>
          <AlertDialogDescription className="font-[Cairo] text-sm text-[var(--text-muted)] text-center leading-relaxed">
            هل أنت متأكد من حذف الجهاز <span className="font-semibold text-[var(--text-main)]">{device.deviceName}</span>؟
          </AlertDialogDescription>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 py-4">
          <AlertDialogCancel size="2xl" className="font-[Cairo] flex-1 bg-transparent border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--table-row-hover)] rounded-xl py-2.5 text-sm font-medium transition-colors">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction size="2xl" className="font-[Cairo] flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl  text-sm font-medium transition-colors" onClick={() => handleDeleteWithUndo(device, onDelete, setHiddenIds)}>
            نعم، احذف
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function handleDeleteWithUndo(device: POSDevice, onDelete: (id: number) => Promise<unknown>, setHiddenIds: React.Dispatch<React.SetStateAction<Set<number>>>) {
  let undone = false;

  setHiddenIds((prev) => new Set(prev).add(device.id));

  toast.success(`تم حذف "${device.deviceName}"`, {
    duration: 5000,
    action: {
      label: "استرجاع",
      onClick: () => {
        undone = true;
        // رجّعه للجدول
        setHiddenIds((prev) => {
          const next = new Set(prev);
          next.delete(device.id);
          return next;
        });
      },
    },
    onDismiss: () => {
      if (!undone) onDelete(device.id);
    },
    onAutoClose: () => {
      if (!undone) onDelete(device.id);
    },
  });
}

function CertificateBadge({ certificateType, isCertificateExpired }: { certificateType: string; isCertificateExpired: boolean }) {
  if (isCertificateExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        منتهي
      </span>
    );
  }

  const isPCSID = certificateType?.toUpperCase().includes("PCSID");

  if (isPCSID) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        PCSID فعال
      </span>
    );
  }

  // CCSID only
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      {certificateType} فقط
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatLastSent(dateStr: string) {
  if (!dateStr || dateStr === "—") return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const timeStr = date.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diffDays === 0) return `اليوم ${timeStr}`;
  if (diffDays === 1) return `أمس ${timeStr}`;
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function POSDevicesList() {
  const { t, direction } = useLanguage();

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<POSDevice | null>(null);
  const { data: devices } = useGetAllPOSDevices();
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set());

  const visibleDevices = useMemo(() => (devices?.data ?? []).filter((d) => !hiddenIds.has(d.id)), [devices?.data, hiddenIds]);
  const { mutateAsync: deleteDevice } = useDeleteDevicePOS();
  //   const { data: deviceData } = useGetPOSDeviceById(selectedDeviceId);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
    setCurrentPage(1);
  };

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input type="text" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("search_placeholder")} className="pr-11" />
      </div>
    </div>
  );

  const header = useMemo(() => renderHeader(), [globalFilterValue, t]);

  return (
    <div className="p-4 space-y-4" dir={direction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("pos_devices") ?? "نقاط البيع"}</CardTitle>
          <CardDescription>{"إدارة أجهزة نقاط البيع المسجلة"}</CardDescription>
          <CardAction>
            <Button
              size="xl"
              variant="default"
              onClick={() => {
                setSelectedDevice(null);
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={20} />
              {"إضافة جهاز"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-3">
          <DataTable
            value={visibleDevices || []}
            lazy
            paginator
            rows={entriesPerPage}
            first={(currentPage - 1) * entriesPerPage}
            totalRecords={devices?.data?.length || 0}
            onPage={(e: DataTablePageEvent) => {
              if (e.page === undefined) return;
              setCurrentPage(e.page + 1);
              setEntriesPerPage(e.rows);
            }}
            loading={!devices?.data}
            header={header}
            responsiveLayout="stack"
            className="custom-green-table custom-compact-table"
            dataKey="id"
            stripedRows={false}
          >
            <Column
              field="deviceName"
              header={t("device_name") ?? "اسم الجهاز"}
              sortable
              style={{ width: "22%" }}
              body={(row: POSDevice) => (
                <div>
                  <div className="font-bold text-gray-900">{row.deviceName}</div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">SN: {row.serialNumber}</div>
                </div>
              )}
            />

            <Column field="branchName" header={t("branch") ?? "الفرع"} style={{ width: "18%" }} body={(row: POSDevice) => <span className="text-sm text-gray-700">{row.branchName ?? "-"}</span>} />

            <Column field="certificateType" header={"حالة الشهادة"} style={{ width: "15%" }} body={(row: POSDevice) => <CertificateBadge certificateType={row.certificateType} isCertificateExpired={row.isCertificateExpired} />} />

            <Column field="currentICV" header={"آخر ICV"} style={{ width: "10%" }} body={(row: POSDevice) => <span className="text-sm font-mono text-gray-700">{row.currentICV ?? 0}</span>} />

            {/* <Column field="lastPIH" header={t("last_sent") ?? "آخر إرسال"} style={{ width: "13%" }} body={(row: POSDevice) => <span className="text-sm text-gray-600">{formatLastSent(row.lastPIH)}</span>} /> */}

            {/* إعدادات / OTP */}
            <Column
              header="العمليات"
              style={{ width: "10%" }}
              body={(row: POSDevice) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedDevice(row);
                      setIsAddModalOpen(true);
                    }}
                    className="btn-minimal-action"
                    title={!row.certificateType?.toUpperCase().includes("PCSID") && row.certificateType?.toUpperCase().includes("CCSID") ? "استكمال التسجيل" : "تعديل"}
                  >
                    <Edit2 size={16} />
                  </button>

                  <DeleteDeviceButton device={row} onDelete={deleteDevice} setHiddenIds={setHiddenIds} />
                  {/* OTP */}
                  <button
                    disabled={row?.id == 1}
                    onClick={() => {
                      setSelectedDevice(row);
                      // setIsOTPModalOpen(true);
                    }}
                    className="btn-minimal-action text-yellow-600 hover:text-yellow-700"
                    title="إدخال OTP"
                  >
                    <KeyRound size={16} />
                  </button>
                </div>
              )}
            />
          </DataTable>
        </CardContent>
      </Card>

      <AddPOSDeviceModal
        device={selectedDevice}
        isOpen={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);

          if (!open) {
            setSelectedDevice(null);
          }
        }}
      />
    </div>
  );
}
