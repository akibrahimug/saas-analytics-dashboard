"use client"

import { useDemoAuth } from "@/lib/demo-auth"
import { hasPermission, type Permission } from "@/lib/roles"

export function usePermissions() {
  const { session } = useDemoAuth()
  const userRole = session?.user?.role || ""

  const can = (permission: Permission): boolean => {
    return hasPermission(userRole, permission)
  }

  return {
    role: userRole,
    can,
    isAdmin: userRole === "admin",
    isManager: userRole === "manager",
    isMember: userRole === "member",
    isViewer: userRole === "viewer",
  }
}
