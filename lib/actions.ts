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

// Function to update KPI metrics
export async function updateKpiMetrics(data: KpiMetric) {
  await redis.set(KEYS.KPI_METRICS, JSON.stringify(data))
  await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
  revalidatePath("/dashboard")
  return { success: true }
}

// Function to update team performance data
export async function updateTeamPerformance(data: TeamPerformanceData) {
  await redis.set(KEYS.TEAM_PERFORMANCE, JSON.stringify(data))
  await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
  revalidatePath("/dashboard")
  return { success: true }
}

// Function to update task completion data
export async function updateTaskCompletion(data: TaskCompletionData) {
  await redis.set(KEYS.TASK_COMPLETION, JSON.stringify(data))
  await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
  revalidatePath("/dashboard")
  return { success: true }
}

// Function to update project progress data
export async function updateProjectProgress(data: ProjectProgressData) {
  await redis.set(KEYS.PROJECT_PROGRESS, JSON.stringify(data))
  await redis.set(KEYS.LAST_UPDATED, new Date().toISOString())
  revalidatePath("/dashboard")
  return { success: true }
}

// Function to add a new announcement
export async function addAnnouncement(announcement: Announcement) {
  const announcements = await getAnnouncements()
  const updatedAnnouncements = [announcement, ...announcements].slice(0, 10) // Keep only the 10 most recent
  await redis.set(KEYS.ANNOUNCEMENTS, JSON.stringify(updatedAnnouncements))
  revalidatePath("/dashboard")
  return { success: true }
}

// Function to get KPI metrics
export async function getKpiMetrics(): Promise<KpiMetric> {
  const data = await redis.get<string>(KEYS.KPI_METRICS)
  if (!data) {
    // Return default data if none exists
    return {
      taskCompletionRate: { value: 87, change: 5.2 },
      avgResponseTime: { value: 2.4, change: -0.3 },
      teamActivity: { value: 92, change: 3.1 },
      communicationFreq: { value: 24, change: 12 },
    }
  }
  return JSON.parse(data)
}

// Function to get team performance data
export async function getTeamPerformance(): Promise<TeamPerformanceData> {
  const data = await redis.get<string>(KEYS.TEAM_PERFORMANCE)
  if (!data) {
    // Return default data if none exists
    return [
      { date: "Jan", productivity: 67, engagement: 78, satisfaction: 82 },
      { date: "Feb", productivity: 70, engagement: 80, satisfaction: 81 },
      { date: "Mar", productivity: 73, engagement: 77, satisfaction: 80 },
      { date: "Apr", productivity: 78, engagement: 82, satisfaction: 83 },
      { date: "May", productivity: 82, engagement: 85, satisfaction: 85 },
      { date: "Jun", productivity: 80, engagement: 87, satisfaction: 88 },
      { date: "Jul", productivity: 85, engagement: 86, satisfaction: 87 },
    ]
  }
  return JSON.parse(data)
}

// Function to get task completion data
export async function getTaskCompletion(): Promise<TaskCompletionData> {
  const data = await redis.get<string>(KEYS.TASK_COMPLETION)
  if (!data) {
    // Return default data if none exists
    return [
      { name: "Team A", completed: 45, pending: 12, overdue: 3 },
      { name: "Team B", completed: 38, pending: 8, overdue: 2 },
      { name: "Team C", completed: 52, pending: 15, overdue: 5 },
      { name: "Team D", completed: 42, pending: 10, overdue: 1 },
      { name: "Team E", completed: 35, pending: 7, overdue: 0 },
    ]
  }
  return JSON.parse(data)
}

// Function to get project progress data
export async function getProjectProgress(): Promise<ProjectProgressData> {
  const data = await redis.get<string>(KEYS.PROJECT_PROGRESS)
  if (!data) {
    // Return default data if none exists
    return [
      { name: "Website Redesign", progress: 85 },
      { name: "Mobile App", progress: 65 },
      { name: "API Integration", progress: 92 },
      { name: "Documentation", progress: 78 },
      { name: "Marketing Campaign", progress: 45 },
    ]
  }
  return JSON.parse(data)
}

// Function to get announcements
export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await redis.get<string>(KEYS.ANNOUNCEMENTS)
  if (!data) {
    // Return default data if none exists
    return [
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
  }
  return JSON.parse(data)
}

// Function to get last updated timestamp
export async function getLastUpdated(): Promise<string> {
  const data = await redis.get<string>(KEYS.LAST_UPDATED)
  return data || new Date().toISOString()
}
