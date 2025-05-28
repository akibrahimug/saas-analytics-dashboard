"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useRealTimeData } from "@/hooks/use-real-time-data";
import type { ProjectProgressData } from "@/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProjectProgressChartProps {
  initialData: ProjectProgressData;
}

export function ProjectProgressChart({
  initialData,
}: ProjectProgressChartProps) {
  const {
    data: rawData,
    error,
    isConnected,
  } = useRealTimeData<ProjectProgressData>("project", initialData);

  // Format data with rounded values
  const data = rawData
    ? rawData.map((item) => ({
        ...item,
        progress: item.progress ? Math.round(item.progress) : item.progress,
      }))
    : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Current progress of active projects
            </CardDescription>
          </div>
          {isConnected && (
            <div
              className="h-2 w-2 rounded-full bg-green-500 animate-pulse"
              title="Live data"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden w-full">
        {error && (
          <Alert variant="destructive" className="mb-4 w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ChartContainer
          config={{
            progress: {
              label: "Progress",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] sm:h-[350px] min-w-0 w-full"
        >
          <ResponsiveContainer width="99%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.3}
                horizontal={true}
                vertical={false}
              />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  value.length > 12 ? `${value.substring(0, 12)}...` : value
                }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="progress"
                fill="var(--color-progress)"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
