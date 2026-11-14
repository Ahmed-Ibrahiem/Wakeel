import { FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "cn";
import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

type Props<S> = {
  label: React.ReactNode;
  nameInSchema: keyof S & string;
  className?: string;
  children?: React.ReactNode;
  labelStyle?: string;
} & ComponentProps<typeof Checkbox>;

export function CheckboxWithLabel<S>({
  label,
  nameInSchema,
  className,
  labelStyle,
  children,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <Controller
      name={nameInSchema}
      control={form.control}
      render={({ field, fieldState }) => {
        return (
          <div
            aria-invalid={fieldState.invalid}
            className="relative flex! flex-row! justify-start! "
          >
            <Checkbox
              id={nameInSchema}
              name={field.name}
              ref={field.ref}
              checked={field.value === true}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.onBlur}
              disabled={form.formState.isSubmitting}
              aria-invalid={fieldState.invalid}
              className={cn("size-6 rounded-sm border-2", className)}
              {...props}
            />
            <FieldLabel
              className={`text-sm font-bold flex-wrap ${labelStyle || ""}`}
              htmlFor={nameInSchema}
            >
              {label}
            </FieldLabel>
            {fieldState.invalid && (
              <FieldError
                className="absolute -bottom-5 "
                errors={[fieldState.error]}
              />
            )}
            {children}
          </div>
        );
      }}
    />
  );
}
