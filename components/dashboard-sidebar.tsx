"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Settings,
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Shield,
  UserCog,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS, type Permission } from "@/lib/roles";
import { getLayoutSettings, setLayoutSettings } from "@/lib/storage";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoAuth } from "@/lib/demo-auth";

interface DashboardSidebarProps {
  isSheet?: boolean;
  closeSheet?: () => void;
}

export function DashboardSidebar({
  isSheet = false,
  closeSheet,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setState } = useSidebar();
  const isMobile = useIsMobile();
  const { isDemoMode } = useDemoAuth();
  // Use a ref to track previous state to avoid unnecessary storage operations
  const prevStateRef = useRef(state);

  // Prepare URL query params for navigation
  const getDemoQueryParam = () => {
    return isDemoMode ? "?demo=true" : "";
  };

  // Load sidebar state from localStorage only once on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile && !isSheet) {
      const layoutSettings = getLayoutSettings();
      if (layoutSettings && layoutSettings.sidebarAlwaysOpen !== undefined) {
        const newState = layoutSettings.sidebarAlwaysOpen
          ? "expanded"
          : "collapsed";
        setState(newState);
      }
    }
    // Only run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save sidebar state to localStorage when it changes, but only when necessary
  useEffect(() => {
    // Don't save state for mobile or sheet sidebars
    if (typeof window === "undefined" || isMobile || isSheet) return;

    // Only save when state actually changes from the previous value
    if (prevStateRef.current !== state) {
      prevStateRef.current = state;
      const layoutSettings = getLayoutSettings() || {};
      setLayoutSettings({
        ...layoutSettings,
        sidebarAlwaysOpen: state === "expanded",
      });
    }
  }, [state, isMobile, isSheet]);

  // Handle navigation with auto-close for mobile
  const handleNavigation = (href: string) => {
    if (isSheet && closeSheet) {
      closeSheet();
    }

    // If we're already on this page, just close the sheet
    if (pathname === href) {
      return;
    }

    // Add demo query param if in demo mode
    const fullHref = isDemoMode ? `${href}${getDemoQueryParam()}` : href;

    // Navigate to the new page
    router.push(fullHref);
  };

  // If it's rendered in a Sheet, we need to use a different approach
  if (isSheet) {
    return (
      <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <BarChart3 className="h-6 w-6" />
          <span className="font-bold">Analytics Dashboard</span>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
              Overview
            </div>
            <div className="space-y-1">
              <div className="space-y-1">
                <PermissionGate permission="VIEW_DASHBOARD">
                  <div>
                    <button
                      onClick={() => handleNavigation("/dashboard")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        pathname === "/dashboard"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>
                  </div>
                </PermissionGate>

                <PermissionGate permission="VIEW_TEAM">
                  <div>
                    <button
                      onClick={() => handleNavigation("/team")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        pathname === "/team"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>Team</span>
                    </button>
                  </div>
                </PermissionGate>

                <div>
                  <button
                    onClick={() => handleNavigation("/calendar")}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === "/calendar"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => handleNavigation("/messages")}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === "/messages"
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <PermissionGate permission="VIEW_SETTINGS">
            <div className="px-3 py-2">
              <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
                Preferences
              </div>
              <div className="space-y-1">
                <div className="space-y-1">
                  <div>
                    <button
                      onClick={() => handleNavigation("/settings")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        pathname === "/settings"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        pathname === "/profile"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGate>

          <PermissionGate permission="ACCESS_ADMIN">
            <div className="px-3 py-2">
              <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
                Administration
              </div>
              <div className="space-y-1">
                <div className="space-y-1">
                  <div>
                    <button
                      onClick={() => handleNavigation("/admin")}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                        pathname === "/admin"
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </button>
                  </div>

                  <PermissionGate permission="MANAGE_USERS">
                    <div>
                      <button
                        onClick={() => handleNavigation("/admin/users")}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === "/admin/users"
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <UserCog className="h-4 w-4" />
                        <span>User Management</span>
                      </button>
                    </div>
                  </PermissionGate>
                </div>
              </div>
            </div>
          </PermissionGate>
        </div>

        <div className="border-t p-4">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  // For desktop, use the Sidebar component
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <BarChart3 className="h-6 w-6" />
          <span className="font-bold">Analytics Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <PermissionGate permission="VIEW_DASHBOARD">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                    tooltip={state === "collapsed" ? "Dashboard" : undefined}
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </PermissionGate>

              <PermissionGate permission="VIEW_TEAM">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/team"}
                    tooltip={state === "collapsed" ? "Team" : undefined}
                  >
                    <Link href="/team">
                      <Users className="h-4 w-4" />
                      <span>Team</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </PermissionGate>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/calendar"}
                  tooltip={state === "collapsed" ? "Calendar" : undefined}
                >
                  <Link href="/calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/messages"}
                  tooltip={state === "collapsed" ? "Messages" : undefined}
                >
                  <Link href="/messages">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <PermissionGate permission="VIEW_SETTINGS">
          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/settings"}
                    tooltip={state === "collapsed" ? "Settings" : undefined}
                  >
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/profile"}
                    tooltip={state === "collapsed" ? "Profile" : undefined}
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </PermissionGate>

        <PermissionGate permission="ACCESS_ADMIN">
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/admin"}
                    tooltip={state === "collapsed" ? "Admin" : undefined}
                  >
                    <Link href="/admin">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <PermissionGate permission="MANAGE_USERS">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/admin/users"}
                      tooltip={
                        state === "collapsed" ? "User Management" : undefined
                      }
                    >
                      <Link href="/admin/users">
                        <UserCog className="h-4 w-4" />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGate>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </PermissionGate>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
