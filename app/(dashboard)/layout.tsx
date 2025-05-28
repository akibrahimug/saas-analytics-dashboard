"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DemoRoleSelector } from "@/components/demo-role-selector";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getLayoutSettings } from "@/lib/storage";
import { useDemoMode } from "@/lib/DemoModeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start with a stable default value for server rendering
  // Important: Use false as the initial value to match what client hydration expects
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { isDemo } = useDemoMode();

  // Only update state after hydration on the client
  useEffect(() => {
    setIsClient(true);

    try {
      // Try to get saved state from localStorage
      const layoutSettings = getLayoutSettings();
      if (layoutSettings && layoutSettings.sidebarAlwaysOpen !== undefined) {
        setDefaultOpen(layoutSettings.sidebarAlwaysOpen);
        return;
      }

      // Default to true for desktop (larger than md breakpoint) and false for mobile
      setDefaultOpen(window.innerWidth >= 768);
    } catch (e) {
      // If any error happens (e.g. localStorage not available), use screen size
      setDefaultOpen(window.innerWidth >= 768);
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen bg-background w-full">
        {/* Header spans full width */}
        <DashboardHeader />

        {/* Content container with max-width on large screens */}
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex min-h-[calc(100vh-4rem)] flex-row">
            <DashboardSidebar />
            <main className="flex-1 w-full overflow-x-hidden p-3 sm:p-4 md:p-6">
              {isDemo && (
                <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm">
                  <p className="font-medium">Demo Mode Active</p>
                  <p className="text-muted-foreground">
                    You are viewing the dashboard with demo data.
                  </p>
                </div>
              )}
              {isDemo && <DemoRoleSelector />}
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
