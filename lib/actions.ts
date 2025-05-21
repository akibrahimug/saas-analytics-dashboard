"use server"

import { revalidatePath } from "next/cache"
import { redis, KEYS } from "./redis"

// Types for our data
export type KpiMetric = {
  taskCompletionRate: { value: number; change: number }
  avgResponseTime: { value: number; change: number }
  teamActivity: { value: number; change: number }
  communicationFreq: { value: number; change: number }
}

export type TeamPerformanceData = {
  date: string
  productivity: number
  engagement: number
  satisfaction: number
}[]

export type TaskCompletionData = {
  name: string
  completed: number
  pending: number
  overdue: number
}[]

export type ProjectProgressData = {
  name: string
  progress: number
}[]

export type Announcement = {
  id: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
  }
  link?: {
    text: string
    url: string
  }
}

// Default data
const DEFAULT_KPI_METRICS: KpiMetric = {
  taskCompletionRate: { value: 87, change: 5.2 },
  avgResponseTime: { value: 2.4, change: -0.3 },
  teamActivity: { value: 92, change: 3.1 },
  communicationFreq: { value: 24, change: 12 },
}

const DEFAULT_TEAM_PERFORMANCE: TeamPerformanceData = [
  { date: "Jan", productivity: 67, engagement: 78, satisfaction: 82 },
  { date: "Feb", productivity: 70, engagement: 80, satisfaction: 81 },
  { date: "Mar", productivity: 73, engagement: 77, satisfaction: 80 },
  { date: "Apr", productivity: 78, engagement: 82, satisfaction: 83 },
  { date: "May", productivity: 82, engagement: 85, satisfaction: 85 },
  { date: "Jun", productivity: 80, engagement: 87, satisfaction: 88 },
  { date: "Jul", productivity: 85, engagement: 86, satisfaction: 87 },
]

const DEFAULT_TASK_COMPLETION: TaskCompletionData = [
  { name: "Team A", completed: 45, pending: 12, overdue: 3 },
  { name: "Team B", completed: 38, pending: 8, overdue: 2 },
  { name: "Team C", completed: 52, pending: 15, overdue: 5 },
  { name: "Team D", completed: 42, pending: 10, overdue: 1 },
  { name: "Team E", completed: 35, pending: 7, overdue: 0 },
]

const DEFAULT_PROJECT_PROGRESS: ProjectProgressData = [
  { name: "Website Redesign", progress: 85 },
  { name: "Mobile App", progress: 65 },
  { name: "API Integration", progress: 92 },
  { name: "Documentation", progress: 78 },
  { name: "Marketing Campaign", progress: 45 },
]

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    content: "We've just released a new version of our product with improved analytics features!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    author: {
      name: "Sarah Johnson",
      avatar: "/abstract-geometric-shapes.png",
    },
    link: {
      text: "View release notes",
      url: "#",
    },
  },
  {
    id: "2",
    content: "Team meeting scheduled for tomorrow at 10:00 AM. Please prepare your weekly updates.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    author: {
      name: "Michael Chen",
      avatar: "/abstract-geometric-shapes.png",
    },
  },
  {
    id: "3",
    content: "New training materials on remote collaboration are now available in the knowledge base.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    author: {
      name: "Emily Rodriguez",
      avatar: "/abstract-geometric-shapes.png",
    },
    link: {
      text: "Access training",
      url: "#",
    },
  },
]

// Function to update KPI metrics
export async function updateKpiMetrics(data: KpiMetric) {
  try {
    console.log("Updating KPI metrics:", data)
    await redis.set(KEYS.KPI_METRICS, JSON.stringify(data))
    await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating KPI metrics:", error)
    throw error
  }
}

// Function to update team performance data
export async function updateTeamPerformance(data: TeamPerformanceData) {
  try {
    console.log("Updating team performance:", data)
    await redis.set(KEYS.TEAM_PERFORMANCE, JSON.stringify(data))
    await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating team performance:", error)
    throw error
  }
}

// Function to update task completion data
export async function updateTaskCompletion(data: TaskCompletionData) {
  try {
    console.log("Updating task completion:", data)
    await redis.set(KEYS.TASK_COMPLETION, JSON.stringify(data))
    await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating task completion:", error)
    throw error
  }
}

// Function to update project progress data
export async function updateProjectProgress(data: ProjectProgressData) {
  try {
    console.log("Updating project progress:", data)
    await redis.set(KEYS.PROJECT_PROGRESS, JSON.stringify(data))
    await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating project progress:", error)
    throw error
  }
}

// Function to add a new announcement
export async function addAnnouncement(announcement: Announcement) {
  try {
    console.log("Adding announcement:", announcement)
    const announcements = await getAnnouncements()
    const updatedAnnouncements = [announcement, ...announcements].slice(0, 10) // Keep only the 10 most recent
    await redis.set(KEYS.ANNOUNCEMENTS, JSON.stringify(updatedAnnouncements))
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error adding announcement:", error)
    throw error
  }
}

// Helper function to safely parse JSON or return the original value if it's already an object
function safelyParseJSON(data: any): any {
  if (typeof data === "string") {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      return null
    }
  }
  // If it's already an object, return it as is
  return data
}

// Function to get KPI metrics
export async function getKpiMetrics(): Promise<KpiMetric> {
  try {
    const data = await redis.get(KEYS.KPI_METRICS)

    if (!data) {
      console.log("No KPI metrics found, returning default data")
      return DEFAULT_KPI_METRICS
    }

    console.log("Retrieved KPI metrics from Redis, type:", typeof data)

    // Safely parse the data if it's a string, or use it directly if it's already an object
    const parsedData = safelyParseJSON(data)

    // Validate the parsed data has the expected structure
    if (!parsedData || !parsedData.taskCompletionRate) {
      console.log("Invalid KPI metrics data, returning default data")
      return DEFAULT_KPI_METRICS
    }

    return parsedData as KpiMetric
  } catch (error) {
    console.error("Error getting KPI metrics:", error)
    return DEFAULT_KPI_METRICS
  }
}

// Function to get team performance data
export async function getTeamPerformance(): Promise<TeamPerformanceData> {
  try {
    const data = await redis.get(KEYS.TEAM_PERFORMANCE)

    if (!data) {
      console.log("No team performance data found, returning default data")
      return DEFAULT_TEAM_PERFORMANCE
    }

    console.log("Retrieved team performance data from Redis")

    // Safely parse the data if it's a string, or use it directly if it's already an object
    const parsedData = safelyParseJSON(data)

    // Validate the parsed data is an array
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log("Invalid team performance data, returning default data")
      return DEFAULT_TEAM_PERFORMANCE
    }

    return parsedData as TeamPerformanceData
  } catch (error) {
    console.error("Error getting team performance:", error)
    return DEFAULT_TEAM_PERFORMANCE
  }
}

// Function to get task completion data
export async function getTaskCompletion(): Promise<TaskCompletionData> {
  try {
    const data = await redis.get(KEYS.TASK_COMPLETION)

    if (!data) {
      console.log("No task completion data found, returning default data")
      return DEFAULT_TASK_COMPLETION
    }

    console.log("Retrieved task completion data from Redis")

    // Safely parse the data if it's a string, or use it directly if it's already an object
    const parsedData = safelyParseJSON(data)

    // Validate the parsed data is an array
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log("Invalid task completion data, returning default data")
      return DEFAULT_TASK_COMPLETION
    }

    return parsedData as TaskCompletionData
  } catch (error) {
    console.error("Error getting task completion:", error)
    return DEFAULT_TASK_COMPLETION
  }
}

// Function to get project progress data
export async function getProjectProgress(): Promise<ProjectProgressData> {
  try {
    const data = await redis.get(KEYS.PROJECT_PROGRESS)

    if (!data) {
      console.log("No project progress data found, returning default data")
      return DEFAULT_PROJECT_PROGRESS
    }

    console.log("Retrieved project progress data from Redis")

    // Safely parse the data if it's a string, or use it directly if it's already an object
    const parsedData = safelyParseJSON(data)

    // Validate the parsed data is an array
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log("Invalid project progress data, returning default data")
      return DEFAULT_PROJECT_PROGRESS
    }

    return parsedData as ProjectProgressData
  } catch (error) {
    console.error("Error getting project progress:", error)
    return DEFAULT_PROJECT_PROGRESS
  }
}

// Function to get announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const data = await redis.get(KEYS.ANNOUNCEMENTS)

    if (!data) {
      console.log("No announcements found, returning default data")
      return DEFAULT_ANNOUNCEMENTS
    }

    console.log("Retrieved announcements from Redis")

    // Safely parse the data if it's a string, or use it directly if it's already an object
    const parsedData = safelyParseJSON(data)

    // Validate the parsed data is an array
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log("Invalid announcements data, returning default data")
      return DEFAULT_ANNOUNCEMENTS
    }

    return parsedData as Announcement[]
  } catch (error) {
    console.error("Error getting announcements:", error)
    return DEFAULT_ANNOUNCEMENTS
  }
}

// Function to get last updated timestamp
export async function getLastUpdated(): Promise<string> {
  try {
    const data = await redis.get(KEYS.LAST_UPDATED)
    return data ? data.toString() : new Date().toISOString()
  } catch (error) {
    console.error("Error getting last updated timestamp:", error)
    return new Date().toISOString()
  }
}
