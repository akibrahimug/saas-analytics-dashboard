"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { name: "Website Redesign", progress: 85 },
  { name: "Mobile App", progress: 65 },
  { name: "API Integration", progress: 92 },
  { name: "Documentation", progress: 78 },
  { name: "Marketing Campaign", progress: 45 },
]

export function ProjectProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>Current progress of active projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            progress: {
              label: "Progress",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={150} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="progress" fill="var(--color-progress)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
