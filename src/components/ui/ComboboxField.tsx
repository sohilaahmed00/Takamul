import { useEffect, useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface ComboboxFieldProps<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  field?: ControllerRenderProps<TFieldValues, TName>;
  value?: string | number;
  onChange?: (val: any) => void;

  items: T[] | undefined;
  valueKey?: keyof T;
  labelKey?: keyof T;
  placeholder?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
  className?: string;
  showClear?: boolean;
}

function ComboboxField<T, TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  field,
  value: valueProp,
  onChange: onChangeProp,
  items,
  valueKey,
  labelKey,
  placeholder,
  onValueChange,
  disabled = false,
  className,
  showClear = false
}: ComboboxFieldProps<T, TFieldValues, TName>) {
  const currentValue = field ? field.value : valueProp;
  const handleChange = field ? field.onChange : onChangeProp;

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (currentValue === undefined || currentValue === null || currentValue === "") {
      setSearchValue("");
      return;
    }

    const selectedItem = (items ?? []).find((item) => {
      if (typeof item === "object" && item !== null && valueKey) {
        return item[valueKey]?.toString() === currentValue?.toString();
      }
      return item?.toString() === currentValue?.toString();
    });

    if (selectedItem) {
      if (typeof selectedItem === "object" && selectedItem !== null && labelKey) {
        setSearchValue(selectedItem[labelKey]?.toString() ?? "");
      } else {
        setSearchValue(selectedItem.toString());
      }
    } else {
      setSearchValue("");
    }
  }, [currentValue, items, valueKey, labelKey]);

  const handleValueChange = (val: string) => {
    if (disabled) return;

    const selectedItem = (items ?? []).find((item) => {
      if (typeof item === "object" && item !== null && valueKey) {
        return item[valueKey]?.toString() === val;
      }
      return item?.toString() === val;
    });

    if (selectedItem) {
      if (typeof selectedItem === "object" && selectedItem !== null && valueKey) {
        const actualValue = selectedItem[valueKey];
        handleChange?.(actualValue);
      } else {
        handleChange?.(selectedItem);
      }
    } else {
      // Fallback: If item not found in local list (e.g. search filtered it out), 
      // still propagate the change if it looks like a valid ID
      handleChange?.(val);
    }

    onValueChange?.(val);
  };

  return (
    <Combobox
      value={currentValue ? currentValue.toString() : ""}
      onValueChange={handleValueChange}
      items={items}
      disabled={disabled}
    >
      <div className={cn("relative w-full", className)}>
        <ComboboxInput
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => !disabled && setSearchValue(e.target.value)}
          disabled={disabled}
          showClear={showClear && !!currentValue}
          className={cn(
            "h-10 ",
            disabled ? "bg-gray-50 dark:bg-slate-900/50 cursor-not-allowed" : ""
          )}
        />
        <ComboboxContent>
          <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
          <ComboboxList>
            {(item: T) => {
              const itemValue = (typeof item === "object" && item !== null && valueKey)
                ? item[valueKey]?.toString()
                : item?.toString();
              const itemLabel = (typeof item === "object" && item !== null && labelKey)
                ? item[labelKey]?.toString()
                : item?.toString();

              return (
                <ComboboxItem key={itemValue} value={itemValue!}>
                  {itemLabel}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </div>
    </Combobox>
  );
}

export default ComboboxField;
