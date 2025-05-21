import { NextResponse } from "next/server"
import {
  updateKpiMetrics,
  updateTeamPerformance,
  updateTaskCompletion,
  updateProjectProgress,
  addAnnouncement,
  getKpiMetrics,
  getTeamPerformance,
  getTaskCompletion,
  getProjectProgress,
} from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const { type } = await request.json()

    switch (type) {
      case "kpi": {
        const currentData = await getKpiMetrics()
        // Randomly update one of the KPI metrics
        const updatedData = { ...currentData }
        const metrics = ["taskCompletionRate", "avgResponseTime", "teamActivity", "communicationFreq"] as const
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]

        // Update the value by +/- 5%
        const change = (Math.random() * 10 - 5) / 100
        updatedData[randomMetric].value = Math.max(0, updatedData[randomMetric].value * (1 + change))

        // Update the change value
        updatedData[randomMetric].change = updatedData[randomMetric].change + (Math.random() * 2 - 1)

        await updateKpiMetrics(updatedData)
        return NextResponse.json({ success: true, message: "KPI metrics updated" })
      }

      case "team": {
        const currentData = await getTeamPerformance()
        // Update the last month's data
        const updatedData = [...currentData]
        const lastIndex = updatedData.length - 1

        // Update each metric by +/- 5%
        updatedData[lastIndex].productivity = Math.max(
          0,
          Math.min(100, updatedData[lastIndex].productivity + (Math.random() * 10 - 5)),
        )
        updatedData[lastIndex].engagement = Math.max(
          0,
          Math.min(100, updatedData[lastIndex].engagement + (Math.random() * 10 - 5)),
        )
        updatedData[lastIndex].satisfaction = Math.max(
          0,
          Math.min(100, updatedData[lastIndex].satisfaction + (Math.random() * 10 - 5)),
        )

        await updateTeamPerformance(updatedData)
        return NextResponse.json({ success: true, message: "Team performance updated" })
      }

      case "task": {
        const currentData = await getTaskCompletion()
        // Update a random team's task completion data
        const updatedData = [...currentData]
        const randomIndex = Math.floor(Math.random() * updatedData.length)

        // Update completed, pending, and overdue tasks
        updatedData[randomIndex].completed = Math.max(
          0,
          updatedData[randomIndex].completed + Math.floor(Math.random() * 7 - 3),
        )
        updatedData[randomIndex].pending = Math.max(
          0,
          updatedData[randomIndex].pending + Math.floor(Math.random() * 5 - 2),
        )
        updatedData[randomIndex].overdue = Math.max(
          0,
          updatedData[randomIndex].overdue + Math.floor(Math.random() * 3 - 1),
        )

        await updateTaskCompletion(updatedData)
        return NextResponse.json({ success: true, message: "Task completion updated" })
      }

      case "project": {
        const currentData = await getProjectProgress()
        // Update a random project's progress
        const updatedData = [...currentData]
        const randomIndex = Math.floor(Math.random() * updatedData.length)

        // Update progress by +/- 5%
        updatedData[randomIndex].progress = Math.max(
          0,
          Math.min(100, updatedData[randomIndex].progress + Math.floor(Math.random() * 11 - 5)),
        )

        await updateProjectProgress(updatedData)
        return NextResponse.json({ success: true, message: "Project progress updated" })
      }

      case "announcement": {
        // Add a new announcement
        const newAnnouncement = {
          id: Date.now().toString(),
          content: `New update: ${Math.random().toString(36).substring(2, 15)}`,
          date: new Date().toISOString(),
          author: {
            name: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez"][Math.floor(Math.random() * 3)],
            avatar: "/abstract-geometric-shapes.png",
          },
        }

        await addAnnouncement(newAnnouncement)
        return NextResponse.json({ success: true, message: "Announcement added" })
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid update type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error simulating update:", error)
    return NextResponse.json({ success: false, message: "Failed to simulate update" }, { status: 500 })
  }
}
