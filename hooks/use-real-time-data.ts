"use client"

import { useState, useEffect, useRef } from "react"

type DataType = "kpi" | "team" | "task" | "project" | "announcements"

// Configuration
const SSE_RETRY_MAX = 3
const POLLING_INTERVAL = 5000 // 5 seconds
const POLLING_ENABLED = true // Set to true to enable polling fallback

export function useRealTimeData<T>(dataType: DataType, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usePolling, setUsePolling] = useState(false)

  // Use refs to track the latest state in callbacks
  const sseRetryCount = useRef(0)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Update initial data when it changes
  useEffect(() => {
    if (initialData) {
      setData(initialData)
    }
  }, [initialData])

  // Cleanup function
  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  // Fetch data using polling
  const fetchDataWithPolling = async () => {
    if (!isMountedRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/data?dataType=${dataType}&t=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (isMountedRef.current) {
        // Only update data if it's not null or undefined
        if (result.data) {
          setData(result.data)
        }
        setLastUpdated(result.lastUpdated || null)
        setError(null)
      }
    } catch (err) {
      console.error(`Polling error for ${dataType}:`, err)
      if (isMountedRef.current) {
        setError(`Error fetching updates. Using static data.`)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  // Fetch data using polling with cache-busting and abort signal
  const fetchData = async () => {
    if (!isMountedRef.current || isLoading) return

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)

    try {
      // Add cache-busting parameter and use the abort signal
      const response = await fetch(`/api/data?dataType=${dataType}&t=${Date.now()}`, {
        signal,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (isMountedRef.current) {
        // Only update data if it's not null or undefined
        if (result.data) {
          setData(result.data)
        }
        setLastUpdated(result.lastUpdated || null)
        setError(null)
      }
    } catch (err) {
      // Ignore abort errors as they're expected when cleaning up
      if (err.name !== "AbortError" && isMountedRef.current) {
        console.error(`Polling error for ${dataType}:`, err)
        setError(`Error fetching updates. Using static data.`)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  // Setup SSE connection
  const setupSSE = () => {
    cleanup()

    try {
      // Create new EventSource connection with a cache-busting parameter
      const timestamp = Date.now()
      eventSourceRef.current = new EventSource(`/api/sse?dataType=${dataType}&t=${timestamp}`)

      // Connection opened
      eventSourceRef.current.onopen = () => {
        if (!isMountedRef.current) return

        setIsConnected(true)
        setError(null)
        sseRetryCount.current = 0
        console.log(`SSE connection established for ${dataType}`)
      }

      // Handle messages
      eventSourceRef.current.onmessage = (event) => {
        if (!isMountedRef.current) return

        try {
          const parsedData = JSON.parse(event.data)

          if (parsedData.type === "connected") {
            setIsConnected(true)
            console.log(`SSE connected for ${dataType}`)
          } else if (parsedData.type === dataType && parsedData.data) {
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
      eventSourceRef.current.onerror = (err) => {
        console.error(`SSE connection error for ${dataType}:`, err)

        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }

        if (!isMountedRef.current) return

        setIsConnected(false)

        // Implement retry logic
        sseRetryCount.current += 1

        if (sseRetryCount.current <= SSE_RETRY_MAX) {
          setError(`Connection lost. Retrying...`)
          setTimeout(setupSSE, 1000 * sseRetryCount.current)
        } else {
          // Switch to polling after max retries
          setError(`Using polling for updates.`)
          setUsePolling(true)
        }
      }
    } catch (err) {
      console.error(`Error setting up SSE for ${dataType}:`, err)

      if (!isMountedRef.current) return

      setError(`Failed to connect. Using polling.`)
      setUsePolling(true)
    }
  }

  // Setup polling
  const setupPolling = () => {
    cleanup()

    // Fetch immediately
    fetchData()

    // Then set up interval
    pollingIntervalRef.current = setInterval(fetchData, POLLING_INTERVAL)
  }

  // Main effect for setting up data fetching
  useEffect(() => {
    isMountedRef.current = true

    // If polling is forced by config, use polling
    if (POLLING_ENABLED && usePolling) {
      console.log(`Using polling for ${dataType}`)
      setupPolling()
    } else {
      // Try SSE first
      setupSSE()
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [dataType, usePolling])

  return {
    data,
    lastUpdated,
    isLoading,
    isConnected: usePolling ? true : isConnected,
    error,
    isPolling: usePolling,
  }
}
