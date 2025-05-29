import { Suspense } from "react";
import { KpiCards } from "@/components/kpi-cards";
import { TeamPerformanceChart } from "@/components/team-performance-chart";
import { TaskCompletionChart } from "@/components/task-completion-chart";
import { ProjectProgressChart } from "@/components/project-progress-chart";
import { AnnouncementsFeed } from "@/components/announcements-feed";
import { LastUpdated } from "@/components/last-updated";
import { DateRangePicker } from "@/components/date-range-picker";
import {
  getKpiMetrics,
  getTeamPerformance,
  getTaskCompletion,
  getProjectProgress,
  getAnnouncements,
  getLastUpdated,
} from "@/lib/actions";

export default async function DashboardPage() {
  // Fetch initial data
  const kpiMetrics = await getKpiMetrics();
  const teamPerformance = await getTeamPerformance();
  const taskCompletion = await getTaskCompletion();
  const projectProgress = await getProjectProgress();
  const announcements = await getAnnouncements();
  const lastUpdated = await getLastUpdated();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col gap-1 sm:gap-2 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Monitor your team's performance and productivity
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full">
        <LastUpdated initialLastUpdated={lastUpdated} />
        <DateRangePicker />
      </div>

      <Suspense fallback={<div className="w-full">Loading KPI metrics...</div>}>
        <KpiCards initialData={kpiMetrics} />
      </Suspense>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
        <Suspense
          fallback={
            <div className="w-full">Loading team performance chart...</div>
          }
        >
          <TeamPerformanceChart initialData={teamPerformance} />
        </Suspense>

        <Suspense
          fallback={<div className="w-full">Loading announcements...</div>}
        >
          <AnnouncementsFeed initialAnnouncements={announcements} />
        </Suspense>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 w-full">
        <Suspense
          fallback={
            <div className="w-full">Loading task completion chart...</div>
          }
        >
          <TaskCompletionChart initialData={taskCompletion} />
        </Suspense>

        <Suspense
          fallback={
            <div className="w-full">Loading project progress chart...</div>
          }
        >
          <ProjectProgressChart initialData={projectProgress} />
        </Suspense>
      </div>
    </div>
  );
}
