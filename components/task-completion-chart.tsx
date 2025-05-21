"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { name: "Team A", completed: 45, pending: 12, overdue: 3 },
  { name: "Team B", completed: 38, pending: 8, overdue: 2 },
  { name: "Team C", completed: 52, pending: 15, overdue: 5 },
  { name: "Team D", completed: 42, pending: 10, overdue: 1 },
  { name: "Team E", completed: 35, pending: 7, overdue: 0 },
]

export function TaskCompletionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion</CardTitle>
        <CardDescription>Task status breakdown by team</CardDescription>
      </CardHeader>
      <CardContent>
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
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
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
