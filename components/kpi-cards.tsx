"use client"

import { Activity, CheckCircle2, Clock, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import type { KpiMetric } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface KpiCardsProps {
  initialData: KpiMetric
}

export function KpiCards({ initialData }: KpiCardsProps) {
  const { data, error, isConnected } = useRealTimeData<KpiMetric>("kpi", initialData)

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading KPI data: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-teal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.taskCompletionRate.value}%</div>
          <p className="text-xs text-muted-foreground">
            {data.taskCompletionRate.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {data.taskCompletionRate.change > 0 ? "+" : ""}
            {data.taskCompletionRate.change}% from last month
          </p>
          {isConnected && <div className="mt-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avgResponseTime.value}h</div>
          <p className="text-xs text-muted-foreground">
            {data.avgResponseTime.change < 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {data.avgResponseTime.change > 0 ? "+" : ""}
            {data.avgResponseTime.change} hours from last week
          </p>
          {isConnected && <div className="mt-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
          <Activity className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.teamActivity.value}%</div>
          <p className="text-xs text-muted-foreground">
            {data.teamActivity.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {data.teamActivity.change > 0 ? "+" : ""}
            {data.teamActivity.change}% from last month
          </p>
          {isConnected && <div className="mt-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Communication Frequency</CardTitle>
          <MessageSquare className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.communicationFreq.value}/day</div>
          <p className="text-xs text-muted-foreground">
            {data.communicationFreq.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {data.communicationFreq.change > 0 ? "+" : ""}
            {data.communicationFreq.change}% from last week
          </p>
          {isConnected && <div className="mt-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </CardContent>
      </Card>
    </div>
  )
}
