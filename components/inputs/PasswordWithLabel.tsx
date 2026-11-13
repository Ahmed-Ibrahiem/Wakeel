"use client";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useFormContext, Controller } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";

type Props<S> = {
  fieldName: string;
  nameInSchema: keyof S & string;
  className?: string;
  disabled?: boolean;
};

export function PasswordWithLabel<S>({
  fieldName,
  nameInSchema,
  className,
  disabled,
  ...props
}: Props<S>) {
  const form = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative flex-start">
              <Input
                className={`w-full p-2.5! rounded-sm border text-sm outline-none! ${className}`}
                disabled={disabled || form.formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                id={nameInSchema}
                type={showPassword ? "text" : "password"}
                {...props}
                {...field}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <IoEyeOff className="size-5" />
                ) : (
                  <IoEye className="size-5" />
                )}
              </button>
            </div>
            {fieldState.invalid && (
              <FieldError
                className="absolute -bottom-5 "
                errors={[fieldState.error]}
              />
            )}
          </Field>
        );
      }}
    />
  );
}
