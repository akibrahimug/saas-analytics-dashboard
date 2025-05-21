import type { NextRequest } from "next/server"
import { redis, KEYS, getChannelName } from "@/lib/redis"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const dataType = request.nextUrl.searchParams.get("dataType")

  if (!dataType) {
    return new Response("Data type is required", { status: 400 })
  }

  // Create a new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial message
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`)

      // Set up Redis subscription
      const channel = getChannelName(dataType)

      // Create a polling mechanism (since Redis pub/sub isn't directly available in REST API)
      let lastData = await redis.get(
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
                  : "",
      )

      const interval = setInterval(async () => {
        try {
          const newData = await redis.get(
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
                      : "",
          )

          if (newData && newData !== lastData) {
            lastData = newData
            controller.enqueue(`data: ${JSON.stringify({ type: dataType, data: JSON.parse(newData as string) })}\n\n`)
          }

          // Also check for last updated timestamp
          const lastUpdated = await redis.get(KEYS.LAST_UPDATED)
          if (lastUpdated) {
            controller.enqueue(`data: ${JSON.stringify({ type: "lastUpdated", data: lastUpdated })}\n\n`)
          }

          // Send a keep-alive message every 30 seconds
          controller.enqueue(`: keep-alive\n\n`)
        } catch (error) {
          console.error("Error polling Redis:", error)
          controller.enqueue(`data: ${JSON.stringify({ type: "error", message: "Error fetching updates" })}\n\n`)
        }
      }, 3000) // Poll every 3 seconds

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
