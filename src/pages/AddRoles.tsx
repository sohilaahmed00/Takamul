import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Permission, Permissions } from "@/lib/permissions";
import { useCreateRole } from "@/features/roles/hooks/useCreateRole";
import { useUpdateRole } from "@/features/roles/hooks/useUpdateRole";

// Parse group name & permission name from value like "العملاء.عرض"
function parsePermission(value: string): { group: string; perm: string } {
  const [group, perm] = value.split(".");
  return { group, perm };
}

// Build a structured map: { groupName: { permName: permValue } }
type PermMap = Record<string, Record<string, string>>;

function buildPermMap(): PermMap {
  const map: PermMap = {};
  for (const groupKey of Object.keys(Permissions) as Permission[]) {
    const groupPerms = Permissions[groupKey];
    for (const [, value] of Object.entries(groupPerms)) {
      const { group, perm } = parsePermission(value as string);
      if (!map[group]) map[group] = {};
      if (perm) map[group][perm] = value as string;
    }
  }
  return map;
}

const permMap = buildPermMap();
const groupNames = Object.keys(permMap);
const COMMON_COLS = ["عرض", "إضافة", "تعديل", "حذف"];

type CheckedState = Record<string, Record<string, boolean>>;

function initState(): CheckedState {
  const s: CheckedState = {};
  for (const g of groupNames) {
    s[g] = {};
    for (const p of Object.keys(permMap[g])) {
      s[g][p] = false;
    }
  }
  return s;
}

function getGroupStatus(state: CheckedState, group: string): "none" | "some" | "all" {
  const vals = Object.values(state[group]);
  const checked = vals.filter(Boolean).length;
  if (checked === 0) return "none";
  if (checked === vals.length) return "all";
  return "some";
}

export default function TableLayout() {
  const [roleName, setRoleName] = useState("");
  const [checked, setChecked] = useState<CheckedState>(initState);
  const { mutateAsync: createRole } = useCreateRole();
  const { mutateAsync: updateRole } = useUpdateRole();

  const toggle = (group: string, perm: string) => {
    setChecked((prev) => ({
      ...prev,
      [group]: { ...prev[group], [perm]: !prev[group][perm] },
    }));
  };

  const toggleAll = (group: string) => {
    const status = getGroupStatus(checked, group);
    const val = status !== "all";
    setChecked((prev) => ({
      ...prev,
      [group]: Object.fromEntries(Object.keys(prev[group]).map((p) => [p, val])),
    }));
  };

  const getSelectedValues = (): string[] => {
    const values: string[] = [];
    for (const g of groupNames) {
      for (const [p, isChecked] of Object.entries(checked[g])) {
        if (isChecked) values.push(permMap[g][p]);
      }
    }
    return values;
  };

  const handleSubmit = async () => {
    // await createRole({ roleName: roleName });
    // await updateRole({roleId:})
    console.log(checked);
    console.log(getSelectedValues());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-foreground mb-1">إضافة صلاحية جديدة</h1>
        <p className="text-sm text-muted-foreground">حدد اسم الصلاحية واختر الأذونات المناسبة</p>
      </div>

      <div className="rounded-xl border bg-card p-5 mb-4">
        <Label htmlFor="role-name" className="mb-2 block">
          اسم الصلاحية
        </Label>
        <Input id="role-name" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="مثال: مدير المبيعات" className="max-w-sm" />
      </div>

      <div className="rounded-xl border bg-card mb-6 overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-sm font-medium text-foreground">الأذونات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-right px-4 py-3 font-medium text-muted-foreground min-w-[140px] border-b">المجموعة</th>
                {COMMON_COLS.map((col) => (
                  <th key={col} className="px-4 py-3 font-medium text-muted-foreground text-center border-b whitespace-nowrap">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-muted-foreground text-center border-b min-w-[180px]">أذونات أخرى</th>
              </tr>
            </thead>
            <tbody>
              {groupNames.map((group) => {
                const status = getGroupStatus(checked, group);
                const extraPerms = Object.keys(permMap[group]).filter((p) => !COMMON_COLS.includes(p));
                return (
                  <tr key={group} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 bg-muted/20">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={status === "all"}
                          // indeterminate via data attr trick
                          data-state={status === "some" ? "indeterminate" : status === "all" ? "checked" : "unchecked"}
                          onCheckedChange={() => toggleAll(group)}
                        />
                        <span className="font-medium text-sm">{group}</span>
                      </div>
                    </td>
                    {COMMON_COLS.map((col) => (
                      <td key={col} className="px-4 py-3 text-center">
                        {permMap[group][col] !== undefined ? <Checkbox checked={checked[group][col] ?? false} onCheckedChange={() => toggle(group, col)} className="mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      {extraPerms.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {extraPerms.map((p) => (
                            <Badge key={p} variant={checked[group][p] ? "default" : "outline"} className="cursor-pointer text-xs font-normal" onClick={() => toggle(group, p)}>
                              {p}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30 text-center block">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => handleSubmit()} disabled={!roleName.trim()}>
          حفظ الصلاحية
        </Button>
        <Button variant="outline" onClick={() => setChecked(initState())}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
