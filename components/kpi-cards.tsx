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

// Default KPI data to use as fallback
const defaultKpiData: KpiMetric = {
  taskCompletionRate: { value: 0, change: 0 },
  avgResponseTime: { value: 0, change: 0 },
  teamActivity: { value: 0, change: 0 },
  communicationFreq: { value: 0, change: 0 },
}

export function KpiCards({ initialData }: KpiCardsProps) {
  // Ensure initialData is not null or undefined
  const safeInitialData = initialData || defaultKpiData

  const { data, error, isConnected } = useRealTimeData<KpiMetric>("kpi", safeInitialData)

  // Ensure data is not null or undefined
  const safeData = data || safeInitialData

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
          <div className="text-2xl font-bold">{safeData.taskCompletionRate.value}%</div>
          <p className="text-xs text-muted-foreground">
            {safeData.taskCompletionRate.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {safeData.taskCompletionRate.change > 0 ? "+" : ""}
            {safeData.taskCompletionRate.change}% from last month
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
          <div className="text-2xl font-bold">{safeData.avgResponseTime.value}h</div>
          <p className="text-xs text-muted-foreground">
            {safeData.avgResponseTime.change < 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {safeData.avgResponseTime.change > 0 ? "+" : ""}
            {safeData.avgResponseTime.change} hours from last week
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
          <div className="text-2xl font-bold">{safeData.teamActivity.value}%</div>
          <p className="text-xs text-muted-foreground">
            {safeData.teamActivity.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {safeData.teamActivity.change > 0 ? "+" : ""}
            {safeData.teamActivity.change}% from last month
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
          <div className="text-2xl font-bold">{safeData.communicationFreq.value}/day</div>
          <p className="text-xs text-muted-foreground">
            {safeData.communicationFreq.change > 0 ? (
              <TrendingUp className="mr-1 inline h-3 w-3 text-teal-500" />
            ) : (
              <TrendingDown className="mr-1 inline h-3 w-3 text-red-500" />
            )}
            {safeData.communicationFreq.change > 0 ? "+" : ""}
            {safeData.communicationFreq.change}% from last week
          </p>
          {isConnected && <div className="mt-2 h-1 w-1 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </CardContent>
      </Card>
    </div>
  )
}
