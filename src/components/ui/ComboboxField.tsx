import { useEffect, useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";

interface ComboboxFieldProps<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  field: ControllerRenderProps<TFieldValues, TName>;
  items: T[] | undefined;
  valueKey: keyof T;
  labelKey: keyof T;
  placeholder?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean; 
}

function ComboboxField<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  field,
  items,
  valueKey,
  labelKey,
  placeholder,
  onValueChange,
  disabled = false, 
}: ComboboxFieldProps<T, TFieldValues, TName>) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const selectedItem = (items ?? []).find((item) => item[valueKey]?.toString() === field.value?.toString());

    const newLabel = selectedItem?.[labelKey]?.toString() ?? "";
    setSearchValue(newLabel);
  }, [field.value, items]);

  const handleValueChange = (val: string) => {
    if (disabled) return; 

    const selectedItem = (items ?? []).find((item) => item[valueKey]?.toString() === val);

    field.onChange(selectedItem?.[valueKey]);
    setSearchValue(selectedItem?.[labelKey]?.toString() ?? "");

    onValueChange?.(val);
  };

  return (
    <Combobox
      value={field.value ? field.value.toString() : ""}
      onValueChange={handleValueChange}
      items={items}
      disabled={disabled} 
    >
      <ComboboxInput
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => !disabled && setSearchValue(e.target.value)}
        disabled={disabled} 
        className={disabled ? "bg-gray-50 cursor-not-allowed" : ""}
      />

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
