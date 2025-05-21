"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AdminPanel() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    kpi: false,
    team: false,
    task: false,
    project: false,
    announcement: false,
  })
  const [lastUpdated, setLastUpdated] = useState<Record<string, string | null>>({
    kpi: null,
    team: null,
    task: null,
    project: null,
    announcement: null,
  })
  const [error, setError] = useState<string | null>(null)

  const simulateUpdate = async (type: string) => {
    setIsLoading({ ...isLoading, [type]: true })
    setError(null)

    try {
      console.log(`Simulating update for ${type}`)
      const response = await fetch("/api/simulate-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (data.success) {
        setLastUpdated({
          ...lastUpdated,
          [type]: new Date().toISOString(),
        })
        toast({
          title: "Update Successful",
          description: data.message,
        })
      } else {
        setError(`Failed to update ${type}: ${data.message}`)
        toast({
          title: "Update Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error simulating ${type} update:`, error)
      setError(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button onClick={() => simulateUpdate("kpi")} disabled={isLoading.kpi} className="w-full relative">
            {isLoading.kpi ? "Updating..." : "Update KPIs"}
            {lastUpdated.kpi && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" title="Updated" />
            )}
          </Button>
          <Button onClick={() => simulateUpdate("team")} disabled={isLoading.team} className="w-full relative">
            {isLoading.team ? "Updating..." : "Update Team Data"}
            {lastUpdated.team && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" title="Updated" />
            )}
          </Button>
          <Button onClick={() => simulateUpdate("task")} disabled={isLoading.task} className="w-full relative">
            {isLoading.task ? "Updating..." : "Update Tasks"}
            {lastUpdated.task && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" title="Updated" />
            )}
          </Button>
          <Button onClick={() => simulateUpdate("project")} disabled={isLoading.project} className="w-full relative">
            {isLoading.project ? "Updating..." : "Update Projects"}
            {lastUpdated.project && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" title="Updated" />
            )}
          </Button>
          <Button
            onClick={() => simulateUpdate("announcement")}
            disabled={isLoading.announcement}
            className="w-full relative"
          >
            {isLoading.announcement ? "Adding..." : "Add Announcement"}
            {lastUpdated.announcement && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" title="Updated" />
            )}
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Use these buttons to simulate real-time data updates. The dashboard will update automatically without
            refreshing the page.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
