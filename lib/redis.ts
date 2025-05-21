import { Redis } from "@upstash/redis"

// Create Redis client using environment variables with retry options
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000),
  },
})

// Key prefixes for different data types
export const KEYS = {
  TEAM_PERFORMANCE: "team:performance",
  TASK_COMPLETION: "task:completion",
  PROJECT_PROGRESS: "project:progress",
  KPI_METRICS: "kpi:metrics",
  ANNOUNCEMENTS: "announcements",
  LAST_UPDATED: "last_updated",
}

// Helper function to generate a unique channel name for a specific data type
export function getChannelName(dataType: string): string {
  return `updates:${dataType}`
}

// Helper function to check Redis connection
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis connection error:", error)
    return false
  }
}
