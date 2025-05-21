"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useRealTimeData } from "@/hooks/use-real-time-data"
import type { TeamPerformanceData } from "@/lib/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TeamPerformanceChartProps {
  initialData: TeamPerformanceData
  className?: string
}

export function TeamPerformanceChart({ initialData, className }: TeamPerformanceChartProps) {
  const { data, error, isConnected } = useRealTimeData<TeamPerformanceData>("team", initialData)

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Productivity, engagement, and satisfaction metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Productivity, engagement, and satisfaction metrics over time</CardDescription>
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
            productivity: {
              label: "Productivity",
              color: "hsl(var(--chart-1))",
            },
            engagement: {
              label: "Engagement",
              color: "hsl(var(--chart-2))",
            },
            satisfaction: {
              label: "Satisfaction",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px] sm:h-[350px] md:h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="var(--color-productivity)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="var(--color-engagement)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="satisfaction"
                stroke="var(--color-satisfaction)"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
