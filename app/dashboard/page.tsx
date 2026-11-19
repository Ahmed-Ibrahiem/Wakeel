import { Suspense } from "react";
import {
  DashboardStats,
  StatsSkeleton,
} from "@/features/dashboard/components/DashboardStats";
import {
  ScheduleSection,
  PanelSkeleton,
} from "@/features/dashboard/components/ScheduleSection";
import { RecentCases } from "@/features/dashboard/components/RecentCases";
import { DeadlinesPanel } from "@/features/dashboard/components/DeadlinesPanel";

const DashboardPage = () => {
  return (
    <div className="flex-col-start gap-2.5 h-full w-full">
      <header className="w-full animate-fade-in">
        <h1 className="text-2xl font-bold">الرئيسية</h1>
        <p className="text-sm text-muted-foreground">
          مرحباً بك في لوحة التحكم الخاصة بك
        </p>
      </header>

      <Suspense fallback={<StatsSkeleton />} >
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<PanelSkeleton />}>
        <ScheduleSection />
      </Suspense>

      <div className="w-full grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] grow">
        <Suspense fallback={<PanelSkeleton />}>
          <DeadlinesPanel />
        </Suspense>
        <Suspense fallback={<PanelSkeleton />}>
          <RecentCases />
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardPage;
