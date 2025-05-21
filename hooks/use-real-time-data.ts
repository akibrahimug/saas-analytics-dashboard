"use client"

import { useState, useEffect } from "react"

type DataType = "kpi" | "team" | "task" | "project" | "announcements"

export function useRealTimeData<T>(dataType: DataType, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set initial data when it changes
    setData(initialData)
  }, [initialData])

  useEffect(() => {
    let eventSource: EventSource | null = null
    let retryCount = 0
    const maxRetries = 5

    const connectSSE = () => {
      try {
        // Close existing connection if any
        if (eventSource) {
          eventSource.close()
        }

        // Create new EventSource connection
        eventSource = new EventSource(`/api/sse?dataType=${dataType}`)

        // Connection opened
        eventSource.onopen = () => {
          setIsConnected(true)
          setError(null)
          retryCount = 0
          console.log(`SSE connection established for ${dataType}`)
        }

        // Handle messages
        eventSource.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data)

            if (parsedData.type === "connected") {
              setIsConnected(true)
              console.log(`SSE connected for ${dataType}`)
            } else if (parsedData.type === dataType) {
              console.log(`Received ${dataType} update:`, parsedData.data)
              setData(parsedData.data)
            } else if (parsedData.type === "lastUpdated") {
              setLastUpdated(parsedData.data)
            }
          } catch (err) {
            console.error(`Error parsing SSE data for ${dataType}:`, err)
          }
        }

        // Handle errors
        eventSource.onerror = (err) => {
          console.error(`SSE connection error for ${dataType}:`, err)
          eventSource?.close()
          setIsConnected(false)

          // Implement retry logic
          retryCount++
          if (retryCount <= maxRetries) {
            const retryDelay = Math.min(1000 * 2 ** retryCount, 30000) // Exponential backoff with max 30s
            setError(`Connection lost. Retrying in ${retryDelay / 1000}s...`)
            setTimeout(connectSSE, retryDelay)
          } else {
            setError("Failed to connect to real-time updates after multiple attempts.")
          }
        }
      } catch (err) {
        console.error(`Error setting up SSE for ${dataType}:`, err)
        setError("Failed to connect to real-time updates.")
      }
    }

    // Start the connection
    connectSSE()

    // Clean up on unmount
    return () => {
      if (eventSource) {
        console.log(`Closing SSE connection for ${dataType}`)
        eventSource.close()
      }
    }
  }, [dataType])

  return { data, lastUpdated, isConnected, error }
}
