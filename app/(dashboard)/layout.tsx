import type React from "react"
import { RoleSelector } from "@/components/role-selector"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold">Remote Team Analytics</span>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col gap-2 p-4">
              <div className="flex h-12 items-center gap-2 px-4">
                <span className="font-semibold">Navigation</span>
              </div>
              <div className="flex flex-col gap-1">
                <a href="/dashboard" className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted">
                  Dashboard
                </a>
                <a href="/dashboard/team" className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted">
                  Team
                </a>
                <a href="/dashboard/settings" className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted">
                  Settings
                </a>
                <a href="/dashboard/admin" className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-muted">
                  Admin
                </a>
              </div>
            </div>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <RoleSelector />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
