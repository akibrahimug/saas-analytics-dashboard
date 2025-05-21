import type { NextRequest } from "next/server"
import { redis, KEYS, getChannelName } from "@/lib/redis"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const dataType = request.nextUrl.searchParams.get("dataType")

  if (!dataType) {
    return new Response("Data type is required", { status: 400 })
  }

  console.log(`SSE connection requested for data type: ${dataType}`)

  // Create a new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial message
        controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
        console.log(`SSE connection established for ${dataType}`)

        // Set up Redis subscription
        const channel = getChannelName(dataType)

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
          controller.enqueue(`data: ${JSON.stringify({ type: "error", message: "Invalid data type" })}\n\n`)
          return
        }

        // Create a polling mechanism (since Redis pub/sub isn't directly available in REST API)
        let lastData = null
        try {
          // Test Redis connection first
          await redis.ping()

          // Get initial data
          lastData = await redis.get(redisKey)
          console.log(`Initial data for ${dataType} retrieved:`, lastData ? "Data found" : "No data")

          // Send initial data if available
          if (lastData) {
            controller.enqueue(`data: ${JSON.stringify({ type: dataType, data: JSON.parse(lastData as string) })}\n\n`)
          }
        } catch (error) {
          console.error(`Error getting initial data for ${dataType}:`, error)
          controller.enqueue(`data: ${JSON.stringify({ type: "error", message: "Error connecting to database" })}\n\n`)
        }

        let isConnectionClosed = false
        request.signal.addEventListener("abort", () => {
          console.log(`SSE connection closed for ${dataType}`)
          isConnectionClosed = true
        })

        const interval = setInterval(async () => {
          // Stop polling if connection is closed
          if (isConnectionClosed) {
            clearInterval(interval)
            return
          }

          try {
            const newData = await redis.get(redisKey)

            if (newData && newData !== lastData) {
              console.log(`New data detected for ${dataType}`)
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
            console.error(`Error polling Redis for ${dataType}:`, error)
            controller.enqueue(`data: ${JSON.stringify({ type: "error", message: "Error fetching updates" })}\n\n`)
          }
        }, 3000) // Poll every 3 seconds

        // Clean up on close
        request.signal.addEventListener("abort", () => {
          clearInterval(interval)
        })
      } catch (error) {
        console.error(`Error in SSE stream for ${dataType}:`, error)
        controller.enqueue(`data: ${JSON.stringify({ type: "error", message: "Server error" })}\n\n`)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for Nginx
    },
  })
}
