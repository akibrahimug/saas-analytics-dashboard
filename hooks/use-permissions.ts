"use client";

import { useSession } from "next-auth/react";
import { useDemoAuth } from "@/lib/demo-auth";
import { hasPermission, type Permission } from "@/lib/roles";
import { useDemoMode } from "@/lib/DemoModeContext";

export function usePermissions() {
  const { isDemo } = useDemoMode();
  const { data: nextAuthSession } = useSession();
  const { session: demoSession } = useDemoAuth();

  // Use the appropriate session based on demo mode
  const session = isDemo ? demoSession : nextAuthSession;
  const userRole = session?.user?.role || "";

  const can = (permission: Permission): boolean => {
    return hasPermission(userRole, permission);
  };

  return {
    role: userRole,
    can,
    isAdmin: userRole === "admin",
    isManager: userRole === "manager",
    isMember: userRole === "member",
    isViewer: userRole === "viewer",
  };
}
