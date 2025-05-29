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
import type { TaskCompletionData } from "@/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TaskCompletionChartProps {
  initialData: TaskCompletionData;
}

export function TaskCompletionChart({ initialData }: TaskCompletionChartProps) {
  const {
    data: rawData,
    error,
    isConnected,
  } = useRealTimeData<TaskCompletionData>("task", initialData);

  // Format data with rounded values
  const data = rawData
    ? rawData.map((item) => ({
        ...item,
        completed: item.completed ? Math.round(item.completed) : item.completed,
        pending: item.pending ? Math.round(item.pending) : item.pending,
        overdue: item.overdue ? Math.round(item.overdue) : item.overdue,
      }))
    : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Task status breakdown by team</CardDescription>
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
          className="h-[300px] sm:h-[350px] min-w-0 w-full"
        >
          <ResponsiveContainer width="99%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="completed"
                fill="var(--color-completed)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                fill="var(--color-pending)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="overdue"
                fill="var(--color-overdue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
