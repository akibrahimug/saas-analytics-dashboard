"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import type { TaskCompletionData } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface TaskCompletionChartProps {
  initialData: TaskCompletionData
}

export function TaskCompletionChart({ initialData }: TaskCompletionChartProps) {
  const { data, error, isConnected } = useRealTimeData<TaskCompletionData>("task", initialData)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Task status breakdown by team</CardDescription>
          </div>
          {isConnected && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Live data" />}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            pending: {
              label: "Pending",
              color: "hsl(var(--chart-2))",
            },
            overdue: {
              label: "Overdue",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px] sm:h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue" fill="var(--color-overdue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
