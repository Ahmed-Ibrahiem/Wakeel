import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useFormContext, Controller } from "react-hook-form";
import { InputHTMLAttributes } from "react";

type Props<S> = {
  fieldName: string;
  nameInSchema: keyof S & string;
  className?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
  fieldName,
  nameInSchema,
  className,
  children,
  disabled,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <Controller
      name={nameInSchema}
      control={form.control}
      render={({ field, fieldState }) => {
        return (
          <Field aria-invalid={fieldState.invalid} className="relative">
            <FieldLabel className="text-sm font-bold" htmlFor={nameInSchema}>
              {fieldName}
            </FieldLabel>
            <Input
              className={`w-full p-2.5! rounded-sm border text-sm outline-none! ${className}`}
              disabled={disabled || form.formState.isSubmitting}
              aria-invalid={fieldState.invalid}
              id={nameInSchema}
              {...props}
              {...field}
            />
            {fieldState.invalid && (
              <FieldError
                className="absolute -bottom-5 "
                errors={[fieldState.error]}
              />
            )}
            {children}
          </Field>
        );
      }}
    />
  );
}
