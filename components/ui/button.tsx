import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — الزرار الأساسي
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 cursor-pointer ",

        // Secondary — الزرار الثانوي
        secondary:
          "border border-primary/25 bg-background text-primary hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 cursor-pointer",

        // Outline — زرار بإطار محايد
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",

        // Ghost — زرار بدون خلفية
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",

        // Destructive — العمليات الخطرة
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",

        // Link — شكل رابط
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
      },

      size: {
        default:
          "lg:h-10 h-8 px-3.5 py-1.5 text-xs lg:text-sm max-h-10 gap-2 lg:px-5 lg:py-2 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",

        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",

        sm: "h-8 gap-1.5 rounded-md px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",

        lg: "h-12 gap-2 rounded-lg px-7 text-base",

        icon: "size-10",

        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",

        "icon-sm": "size-8 rounded-md",

        "icon-lg": "size-12 rounded-lg",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
