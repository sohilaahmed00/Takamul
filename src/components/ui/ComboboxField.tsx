import { useEffect, useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";

interface ComboboxFieldProps<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  // إما field أو value + onChange
  field?: ControllerRenderProps<TFieldValues, TName>;
  value?: string | number;
  onChange?: (val: string) => void;

  items: T[] | undefined;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
}

function ComboboxField<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ field, value: valueProp, onChange: onChangeProp, items, valueKey, labelKey, placeholder, onValueChange, disabled = false }: ComboboxFieldProps<T, TFieldValues, TName>) {
  // موحّد — يشتغل مع field أو بدونه
  const currentValue = field ? field.value : valueProp;
  const handleChange = field ? field.onChange : onChangeProp;

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const selectedItem = (items ?? []).find((item) => item[valueKey]?.toString() === currentValue?.toString());
    setSearchValue(selectedItem?.[labelKey]?.toString() ?? "");
  }, [currentValue, items]);

  const handleValueChange = (val: string) => {
    if (disabled) return;
    const selectedItem = (items ?? []).find((item) => item[valueKey]?.toString() === val);
    handleChange?.(selectedItem?.[valueKey]);
    setSearchValue(selectedItem?.[labelKey]?.toString() ?? "");
    onValueChange?.(val);
  };

  return (
    <Combobox value={currentValue ? currentValue.toString() : ""} onValueChange={handleValueChange} items={items} disabled={disabled}>
      <ComboboxInput placeholder={placeholder} value={searchValue} onChange={(e) => !disabled && setSearchValue(e.target.value)} disabled={disabled} className={disabled ? "bg-gray-50 cursor-not-allowed" : ""} />
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
