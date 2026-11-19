"use client";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, Controller } from "react-hook-form";
import type { LucideIcon } from "lucide-react";

// Type definition for a single option inside the dropdown list
type Option = {
  id: string | number;
  label: string;
};

type Props<S> = {
  fieldName: string; // Arabic label text to display (e.g., "الموكل", "نوع القضية")
  nameInSchema: keyof S & string; // Field name in the Zod Schema (e.g., "clientId", "caseType")
  options: Option[]; // Items to be displayed in the dropdown
  placeholder?: string; // Placeholder text
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon; // Optional icon shown inside the trigger, before the value
};

export function SelectWithLabel<S>({
  fieldName,
  nameInSchema,
  options,
  placeholder = "اختر...",
  className,
  disabled,
  icon: Icon,
}: Props<S>) {
  const form = useFormContext();

  return (
    <Controller
      name={nameInSchema}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field aria-invalid={fieldState.invalid} className="relative">
          <FieldLabel className="text-sm font-bold" htmlFor={nameInSchema}>
            {fieldName}
          </FieldLabel>

          <Select
            dir="rtl"
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled || form.formState.isSubmitting}
          >
            <SelectTrigger
              id={nameInSchema}
              className={`w-full ${className ?? ""}`}
              aria-invalid={fieldState.invalid}
            >
              <span className="flex-start gap-2">
                {Icon && <Icon className="size-4 text-muted-foreground" />}
                <SelectValue placeholder={placeholder} />
              </span>
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && (
            <FieldError
              className="absolute -bottom-5"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
}
