"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Menu, UserIcon, LogOut, Settings } from "lucide-react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RoleBadge } from "@/components/role-badge";
import { useDemoAuth } from "@/lib/demo-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoMode } from "@/lib/DemoModeContext";

// Real-auth header
function RealAuthHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const { exitDemo } = useDemoMode();

  useEffect(() => {
    if (session?.user && sessionStorage.getItem("demoMode")) {
      exitDemo();
    }
  }, [session, exitDemo]);

  const getFirstName = (name?: string | null) =>
    name ? name.split(" ")[0] : "U";

  const handleSignOut = () => {
    nextAuthSignOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <DashboardSidebar
                  isSheet
                  closeSheet={() => setSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <SidebarTrigger
              className="hidden md:flex"
              aria-label="Toggle Menu"
            />
          )}
          <div className="relative ml-2 flex-1 md:ml-4 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full md:w-[300px] pl-8 bg-background"
            />
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>
                    {getFirstName(session?.user?.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>My Account</span>
                {session?.user?.role && <RoleBadge role={session.user.role} />}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

// Demo-auth header
function DemoAuthHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { session, signOut: demoAuthSignOut } = useDemoAuth();
  const { exitDemo } = useDemoMode();
  const isMobile = useIsMobile();

  const getFirstName = (name?: string | null) =>
    name ? name.split(" ")[0] : "U";

  const handleSignOut = () => {
    exitDemo();
    demoAuthSignOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <DashboardSidebar
                  isSheet
                  closeSheet={() => setSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <SidebarTrigger
              className="hidden md:flex"
              aria-label="Toggle Menu"
            />
          )}
          <div className="relative ml-2 flex-1 md:ml-4 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full md:w-[300px] pl-8 bg-background"
            />
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback>
                    {getFirstName(session?.user?.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>My Account</span>
                {session?.user?.role && <RoleBadge role={session.user.role} />}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

export function DashboardHeader() {
  const [authMode, setAuthMode] = useState<"demo" | "real" | "loading">(
    "loading"
  );

  useEffect(() => {
    const isDemo = !!sessionStorage.getItem("demoMode");
    setAuthMode(isDemo ? "demo" : "real");
  }, []);

  if (authMode === "loading") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="mx-auto w-full max-w-[1600px] px-4 flex h-16 items-center justify-between">
          <div className="h-9 w-9 bg-muted rounded"></div>
          <div className="h-9 w-9 bg-muted rounded-full"></div>
        </div>
      </header>
    );
  }

  return authMode === "demo" ? <DemoAuthHeader /> : <RealAuthHeader />;
}
