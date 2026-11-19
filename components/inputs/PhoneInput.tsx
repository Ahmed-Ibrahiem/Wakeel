// components/inputs/PhoneInput.tsx
"use client";
import { useController, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type Props<S> = {
  label: string;
  dialCodeName: keyof S & string;
  phoneName: keyof S & string;
  className?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function PhoneInput<S>({
  label,
  dialCodeName,
  phoneName,
  className,
  disabled,
  ...props
}: Props<S>) {
  const { control, formState } = useFormContext();
  const { field: dial, fieldState: dialState } = useController({
    name: dialCodeName,
    control,
  });
  const { field: phone, fieldState: phoneState } = useController({
    name: phoneName,
    control,
  });

  const error = phoneState.error ?? dialState.error;

  return (
    <Field aria-invalid={!!error} className="relative">
      <FieldLabel className="text-sm font-bold" htmlFor={phoneName}>
        {label}
      </FieldLabel>

      <div dir="ltr" className="flex gap-2">
        <Select
          value={dial.value}
          onValueChange={dial.onChange}
          disabled={formState.isSubmitting}
        >
          <SelectTrigger
            aria-label="كود الدولة"
            aria-invalid={!!dialState.error}
            onBlur={dial.onBlur}
            className="w-24 shrink-0 h-full! rounded-sm! py-2!"
          >
            <SelectValue>{dial.value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.dial}>
                {c.dial} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          {...phone}
          id={phoneName}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          dir="ltr"
          disabled={disabled || formState.isSubmitting}
          aria-invalid={!!phoneState.error}
          onChange={(e) => phone.onChange(e.target.value.replace(/\D/g, ""))}
          className={cn(
            "w-full p-2.5! rounded-sm border text-sm outline-none!",
            className,
          )}
          {...props}
        />
      </div>

      {error && <FieldError className="absolute -bottom-5" errors={[error]} />}
    </Field>
  );
}
