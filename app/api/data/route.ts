import { type NextRequest, NextResponse } from "next/server"
import {
  getKpiMetrics,
  getTeamPerformance,
  getTaskCompletion,
  getProjectProgress,
  getAnnouncements,
  getLastUpdated,
} from "@/lib/actions"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const dataType = request.nextUrl.searchParams.get("dataType")

    if (!dataType) {
      return NextResponse.json({ error: "Data type is required" }, { status: 400 })
    }

    let data
    const lastUpdated = await getLastUpdated()

    // Get the appropriate data based on data type
    switch (dataType) {
      case "kpi":
        data = await getKpiMetrics()
        break
      case "team":
        data = await getTeamPerformance()
        break
      case "task":
        data = await getTaskCompletion()
        break
      case "project":
        data = await getProjectProgress()
        break
      case "announcements":
        data = await getAnnouncements()
        break
      default:
        return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    return NextResponse.json({
      data,
      lastUpdated,
    })
  } catch (error) {
    console.error("Error in data API:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
