"use client"

import type React from "react"

import { usePermissions } from "@/hooks/use-permissions"
import type { Permission } from "@/lib/roles"

interface PermissionGateProps {
  permission: Permission
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { can } = usePermissions()

  if (!can(permission)) {
    return fallback
  }

  return <>{children}</>
}
