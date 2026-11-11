"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";

export function MobileNav({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="القائمة">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-64 border-0 bg-primary p-0 text-primary-foreground"
      >
        <SheetTitle className="sr-only">القائمة</SheetTitle>
        <SidebarContent name={name} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
