"use client";

import { useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CasesSearch({ q }: { q: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const typing = document.activeElement === input && document.hasFocus();
    if (!typing) input.value = q;
  }, [q]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function search(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const text = value.trim();
    if (text) params.set("q", text);
    else params.delete("q");
    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <form
      role="search"
      className="relative w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        search(inputRef.current?.value ?? "");
      }}
    >
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={q}
        maxLength={100}
        autoComplete="off"
        placeholder="ابحث برقم القضية أو اسم العميل أو المحكمة..."
        aria-label="بحث في القضايا"
        className="p-2 ps-8! rounded-sm! text-sm"
        onChange={(e) => {
          clearTimeout(timer.current);
          const value = e.target.value;
          timer.current = setTimeout(() => search(value), 500);
        }}
      />
      {isPending && (
        <Loader2 className="absolute end-6 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
      )}
    </form>
  );
}