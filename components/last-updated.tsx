"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LastUpdatedProps {
  initialLastUpdated: string
}

export function LastUpdated({ initialLastUpdated }: LastUpdatedProps) {
  const [lastUpdated, setLastUpdated] = useState<string>(initialLastUpdated)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Set up SSE for last updated timestamp
    const eventSource = new EventSource("/api/sse?dataType=lastUpdated")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data)
        if (parsedData.type === "lastUpdated") {
          setLastUpdated(parsedData.data)
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <RefreshCw
                className={`h-4 w-4 ${isConnected ? "text-green-500 animate-spin" : "text-muted-foreground"}`}
              />
              <span className="text-sm text-muted-foreground">
                Last updated: {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{isConnected ? "Real-time updates active" : "Real-time updates disconnected"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isConnected && (
        <Badge variant="outline" className="bg-green-500/10 text-green-500">
          Live
        </Badge>
      )}
    </div>
  )
}
