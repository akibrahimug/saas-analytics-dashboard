import type { NextRequest } from "next/server";
import { redis, KEYS, getChannelName } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const dataType = request.nextUrl.searchParams.get("dataType");

  if (!dataType) {
    return new Response("Data type is required", { status: 400 });
  }

  console.log(`SSE connection requested for data type: ${dataType}`);

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
      console.log(`SSE connection established for ${dataType}`);

      const channel = getChannelName(dataType);
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
          : "";

      if (!redisKey) {
        controller.enqueue(
          `data: ${JSON.stringify({
            type: "error",
            message: "Invalid data type",
          })}\n\n`
        );
        controller.close();
        return;
      }

      let lastData: string | null = null;
      let lastUpdated: string | null = null;

      try {
        lastData = await redis.get(redisKey);
        console.log(
          `Initial data for ${dataType} retrieved:`,
          lastData ? "Data found" : "No data"
        );
      } catch (error) {
        console.error(`Error getting initial data for ${dataType}:`, error);
      }

      const interval = setInterval(async () => {
        try {
          const raw = await redis.get(redisKey);
          let payload: any = raw;

          if (typeof raw === "string") {
            try {
              payload = JSON.parse(raw);
            } catch {
              payload = raw;
            }
          }

          if (raw && raw !== lastData) {
            console.log(`New data detected for ${dataType}`);
            lastData = raw;
            controller.enqueue(
              `data: ${JSON.stringify({
                type: dataType,
                data: payload,
              })}\n\n`
            );
          }

          const lu = await redis.get(KEYS.LAST_UPDATED);
          if (lu && lu !== lastUpdated) {
            lastUpdated = lu;
            controller.enqueue(
              `data: ${JSON.stringify({
                type: "lastUpdated",
                data: lu,
              })}\n\n`
            );
          }

          controller.enqueue(`: keep-alive\n\n`);
        } catch (error) {
          console.error(`Error polling Redis for ${dataType}:`, error);
          controller.enqueue(
            `data: ${JSON.stringify({
              type: "error",
              message: "Error fetching updates",
            })}\n\n`
          );
        }
      }, 3000);

      // Prevent this interval from keeping Node.js alive once everything else is done
      if (typeof (interval as any).unref === "function") {
        (interval as any).unref();
      }

      // When client disconnects, stop polling and close the stream
      request.signal.addEventListener("abort", () => {
        console.log(`SSE connection closed for ${dataType}`);
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // for Nginx
    },
  });
}
