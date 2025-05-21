import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DemoRoleSelector } from "@/components/demo-role-selector"
import { DemoAuthProvider } from "@/lib/demo-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoAuthProvider>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen flex-col">
          <DashboardHeader />
          <div className="flex flex-1">
            <aside className="hidden w-64 border-r bg-sidebar md:block">
              <DashboardSidebar />
            </aside>
            <main className="flex-1 p-4 md:p-6">
              <DemoRoleSelector />
              {children}
            </main>
          </div>
        </div>
      </div>
    </DemoAuthProvider>
  )
}
