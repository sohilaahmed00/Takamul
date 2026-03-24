import { useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";

interface ComboboxFieldProps<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  field: ControllerRenderProps<TFieldValues, TName>;
  items: T[] | undefined;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  onValueChange?: (val: string) => void; // ✅ أضف ده
}

function ComboboxField<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ field, items, valueKey, labelKey, placeholder, onValueChange }: ComboboxFieldProps<T, TFieldValues, TName>) {
  const [searchValue, setSearchValue] = useState(items?.find((item) => item[valueKey] === field.value)?.[labelKey]?.toString() ?? "");

  const handleValueChange = (val: string) => {
    field.onChange(Number(val));
    setSearchValue((items ?? []).find((item) => item[valueKey]?.toString() === val)?.[labelKey]?.toString() ?? "");
    onValueChange?.(val); // ✅ وده
  };

  return (
    <Combobox value={field.value ? field.value.toString() : ""} onValueChange={handleValueChange} items={items}>
      <ComboboxInput placeholder={placeholder} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      <ComboboxContent>
        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => (
            <ComboboxItem key={item[valueKey]?.toString()} value={item[valueKey]?.toString()}>
              {item[labelKey]?.toString()}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default ComboboxField;
