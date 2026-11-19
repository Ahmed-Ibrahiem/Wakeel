"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: number;
  sizes: readonly number[];
  defaultSize: number;
};

export function PageSizeSelect({ value, sizes, defaultSize }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (next: string) => {
    // Keep every other param (search, filter, archived), only touch pageSize and page
    const params = new URLSearchParams(searchParams.toString());

    if (Number(next) === defaultSize) params.delete("pageSize");
    else params.set("pageSize", next);

    // The old page number may not exist with the new size, so start from page 1
    params.delete("page");

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex-start gap-2 text-sm text-muted-foreground">
      <span>عدد العناصر في الصفحة</span>
      <Select dir="rtl" value={String(value)} onValueChange={onChange}>
        <SelectTrigger
          aria-label="عدد العناصر في الصفحة"
          className="h-9 w-20"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sizes.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}