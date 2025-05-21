"use client"

import * as React from "react"
import { Tooltip as RechartsTooltip, type TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  // Create CSS variables for chart colors
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className={cn("", className)} style={style} {...props}>
      {children}
    </div>
  )
}

export function ChartTooltip({ active, payload, label, content, ...props }: TooltipProps<any, any>) {
  if (!active || !payload?.length) {
    return null
  }

  if (content) {
    return React.cloneElement(content as React.ReactElement, {
      active,
      payload,
      label,
      ...props,
    })
  }

  return (
    <RechartsTooltip
      content={
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {payload.map((item: any) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-xs font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      }
      {...props}
    />
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="text-xs font-bold">{label}</div>
      <div className="mt-1 grid gap-0.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}:</span>
            <span className="text-xs font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
