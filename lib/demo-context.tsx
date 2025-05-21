"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define roles
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
}

// Define role names
export const ROLE_NAMES = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MANAGER]: "Team Manager",
  [ROLES.MEMBER]: "Team Member",
  [ROLES.VIEWER]: "Viewer",
}

// Define demo user
const DEFAULT_USER = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  role: ROLES.ADMIN,
}

// Create context
type DemoContextType = {
  user: typeof DEFAULT_USER
  setUserRole: (role: string) => void
  isAdmin: boolean
  isManager: boolean
  isMember: boolean
  isViewer: boolean
  canAccess: (requiredRole: string) => boolean
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

// Provider component
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(DEFAULT_USER)

  // Set user role
  const setUserRole = (role: string) => {
    setUser({ ...user, role })
    try {
      localStorage.setItem("demoUserRole", role)
    } catch (e) {
      console.error("Failed to save role to localStorage", e)
    }
  }

  // Load saved role on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("demoUserRole")
      if (savedRole) {
        setUser({ ...user, role: savedRole })
      }
    } catch (e) {
      console.error("Failed to load role from localStorage", e)
    }
  }, [])

  // Role checks
  const isAdmin = user.role === ROLES.ADMIN
  const isManager = user.role === ROLES.MANAGER
  const isMember = user.role === ROLES.MEMBER
  const isViewer = user.role === ROLES.VIEWER

  // Permission check
  const canAccess = (requiredRole: string) => {
    const roleHierarchy = [ROLES.VIEWER, ROLES.MEMBER, ROLES.MANAGER, ROLES.ADMIN]
    const userRoleIndex = roleHierarchy.indexOf(user.role)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)
    return userRoleIndex >= requiredRoleIndex
  }

  return (
    <DemoContext.Provider value={{ user, setUserRole, isAdmin, isManager, isMember, isViewer, canAccess }}>
      {children}
    </DemoContext.Provider>
  )
}

// Hook to use the demo context
export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}
