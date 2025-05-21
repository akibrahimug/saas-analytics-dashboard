"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export function AdminPanel() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    kpi: false,
    team: false,
    task: false,
    project: false,
    announcement: false,
  })

  const simulateUpdate = async (type: string) => {
    setIsLoading({ ...isLoading, [type]: true })

    try {
      const response = await fetch("/api/simulate-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Update Successful",
          description: data.message,
        })
      } else {
        toast({
          title: "Update Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to simulate update",
        variant: "destructive",
      })
    } finally {
      setIsLoading({ ...isLoading, [type]: false })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Simulate real-time data updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button onClick={() => simulateUpdate("kpi")} disabled={isLoading.kpi} className="w-full">
            {isLoading.kpi ? "Updating..." : "Update KPIs"}
          </Button>
          <Button onClick={() => simulateUpdate("team")} disabled={isLoading.team} className="w-full">
            {isLoading.team ? "Updating..." : "Update Team Data"}
          </Button>
          <Button onClick={() => simulateUpdate("task")} disabled={isLoading.task} className="w-full">
            {isLoading.task ? "Updating..." : "Update Tasks"}
          </Button>
          <Button onClick={() => simulateUpdate("project")} disabled={isLoading.project} className="w-full">
            {isLoading.project ? "Updating..." : "Update Projects"}
          </Button>
          <Button onClick={() => simulateUpdate("announcement")} disabled={isLoading.announcement} className="w-full">
            {isLoading.announcement ? "Adding..." : "Add Announcement"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
