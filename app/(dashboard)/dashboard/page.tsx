import type { Metadata } from "next"
import { DateRangePicker } from "@/components/date-range-picker"
import { KpiCards } from "@/components/kpi-cards"
import { TeamPerformanceChart } from "@/components/team-performance-chart"
import { TaskCompletionChart } from "@/components/task-completion-chart"
import { ProjectProgressChart } from "@/components/project-progress-chart"
import { AnnouncementsFeed } from "@/components/announcements-feed"
import { getAnnouncements } from "@/lib/contentful"

export const metadata: Metadata = {
  title: "Dashboard | Remote Team Analytics",
  description: "View your team's performance metrics",
}

export default async function DashboardPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your team's performance and productivity</p>
      </div>

      <div className="flex justify-end">
        <DateRangePicker />
      </div>

      <KpiCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TeamPerformanceChart className="lg:col-span-2" />
        <AnnouncementsFeed announcements={announcements} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TaskCompletionChart />
        <ProjectProgressChart />
      </div>
    </div>
  )
}
