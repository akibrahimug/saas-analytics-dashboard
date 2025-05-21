"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Settings, Users, Calendar, MessageSquare, LayoutDashboard, Shield, UserCog } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PermissionGate } from "@/components/permission-gate"
import { PERMISSIONS } from "@/lib/roles"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-2">
        <BarChart3 className="h-6 w-6" />
        <span className="font-bold">Analytics Dashboard</span>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">Overview</h2>
          <div className="space-y-1">
            <PermissionGate permission={PERMISSIONS.VIEW_DASHBOARD}>
              <NavItem
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
                isActive={pathname === "/dashboard"}
              >
                Dashboard
              </NavItem>
            </PermissionGate>

            <PermissionGate permission={PERMISSIONS.VIEW_TEAM}>
              <NavItem href="/team" icon={<Users className="h-4 w-4" />} isActive={pathname === "/team"}>
                Team
              </NavItem>
            </PermissionGate>

            <NavItem href="/calendar" icon={<Calendar className="h-4 w-4" />} isActive={pathname === "/calendar"}>
              Calendar
            </NavItem>

            <NavItem href="/messages" icon={<MessageSquare className="h-4 w-4" />} isActive={pathname === "/messages"}>
              Messages
            </NavItem>
          </div>
        </div>

        <PermissionGate permission={PERMISSIONS.VIEW_SETTINGS}>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">Preferences</h2>
            <div className="space-y-1">
              <NavItem href="/settings" icon={<Settings className="h-4 w-4" />} isActive={pathname === "/settings"}>
                Settings
              </NavItem>
            </div>
          </div>
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.ACCESS_ADMIN}>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">Administration</h2>
            <div className="space-y-1">
              <NavItem href="/admin" icon={<Shield className="h-4 w-4" />} isActive={pathname === "/admin"}>
                Admin Panel
              </NavItem>

              <PermissionGate permission={PERMISSIONS.MANAGE_USERS}>
                <NavItem
                  href="/admin/users"
                  icon={<UserCog className="h-4 w-4" />}
                  isActive={pathname === "/admin/users"}
                >
                  User Management
                </NavItem>
              </PermissionGate>
            </div>
          </div>
        </PermissionGate>
      </div>

      <div className="p-4 border-t">
        <ThemeToggle />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  isActive?: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, isActive, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
