"use client";
import { Scale } from "lucide-react";
import NavLinks from "./NavLinks";
import { UserMenu } from "./UserMenu";

export function SidebarContent({
  name,
  onNavigate,
}: {
  name: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8 flex-start gap-2 px-2 pt-2 text-2xl font-bold">
        <Scale className="size-8 mt-1" />
        وكيل
      </div>
      <div className="flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <UserMenu name={name} />
    </div>
  );
}
