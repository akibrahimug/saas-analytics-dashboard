import type { NextRequest } from "next/server"
import { redis, KEYS } from "@/lib/redis"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const dataType = request.nextUrl.searchParams.get("dataType")

  if (!dataType) {
    return Response.json({ error: "Data type is required" }, { status: 400 })
  }

  try {
    // Get the appropriate Redis key based on data type
    const redisKey =
      dataType === "kpi"
        ? KEYS.KPI_METRICS
        : dataType === "team"
          ? KEYS.TEAM_PERFORMANCE
          : dataType === "task"
            ? KEYS.TASK_COMPLETION
            : dataType === "project"
              ? KEYS.PROJECT_PROGRESS
              : dataType === "announcements"
                ? KEYS.ANNOUNCEMENTS
                : ""

    if (!redisKey) {
      return Response.json({ error: "Invalid data type" }, { status: 400 })
    }

    // Get data from Redis
    const data = await redis.get(redisKey)
    const lastUpdated = await redis.get(KEYS.LAST_UPDATED)

    return Response.json({
      data: data ? JSON.parse(data as string) : null,
      lastUpdated,
    })
  } catch (error) {
    console.error(`Error fetching data for ${dataType}:`, error)
    return Response.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
