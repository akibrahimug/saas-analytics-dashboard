"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface TeamPerformanceChartProps {
  className?: string
}

const data = [
  { date: "Jan", productivity: 67, engagement: 78, satisfaction: 82 },
  { date: "Feb", productivity: 70, engagement: 80, satisfaction: 81 },
  { date: "Mar", productivity: 73, engagement: 77, satisfaction: 80 },
  { date: "Apr", productivity: 78, engagement: 82, satisfaction: 83 },
  { date: "May", productivity: 82, engagement: 85, satisfaction: 85 },
  { date: "Jun", productivity: 80, engagement: 87, satisfaction: 88 },
  { date: "Jul", productivity: 85, engagement: 86, satisfaction: 87 },
]

export function TeamPerformanceChart({ className }: TeamPerformanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Productivity, engagement, and satisfaction metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
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
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
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
