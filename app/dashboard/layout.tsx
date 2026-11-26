import { MobileNav } from "@/components/dashboard/MobileNav";
import { SidebarContent } from "@/components/dashboard/SidebarContent";
import { SessionWatcher } from "@/features/dashboard/components/SessionWatcher";
import { requireSession } from "@/lib/session";
import React from "react";
import { isDemoUser } from "@/features/demo/constants";
import DemoBanner from "@/features/demo/components/DemoBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireSession();

  return (
    <div className="flex min-h-screen bg-accent/35">
      <aside className="hidden w-65 shrink-0 bg-primary text-primary-foreground lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent name={user.name} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex-start gap-2 border-b bg-background px-4 py-3 lg:hidden">
          <MobileNav name={user.name} />
          <span className="text-lg font-bold">وكيل</span>
        </header>
        {isDemoUser(user.id) && <DemoBanner />}
        <main className="flex-1 p-3">{children}</main>

        <SessionWatcher />
      </div>
    </div>
  );
}
