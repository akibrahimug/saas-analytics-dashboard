"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Settings,
  Users,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Shield,
  UserCog,
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
import { PERMISSIONS } from "@/lib/roles";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

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
              <PermissionGate permission={PERMISSIONS.VIEW_DASHBOARD}>
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

              <PermissionGate permission={PERMISSIONS.VIEW_TEAM}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
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

        <PermissionGate permission={PERMISSIONS.VIEW_SETTINGS}>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.ACCESS_ADMIN}>
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

                <PermissionGate permission={PERMISSIONS.MANAGE_USERS}>
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
