import DemoBanner from "@/features/demo/components/DemoBanner";
import { isDemoUser } from "@/features/demo/constants";
import { requireSession } from "@/lib/session";
import type { LucideIcon } from "lucide-react";
import React from "react";

export async function PageHeader({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { user } = await requireSession();
  return (
    <header className="flex-between gap-5 flex-wrap w-full">
      <div className="flex-start gap-3">
        {Icon && (
          <span className="flex-center size-13 shrink-0 rounded-lg bg-secondary text-primary">
            <Icon className="size-7" aria-hidden />
          </span>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </header>
  );
}
