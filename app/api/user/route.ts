import { NextResponse } from "next/server";
import { getUserData, getCurrentUser } from "@/lib/auth";
import { demoUser } from "@/lib/demo-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Demo data to use when running in demo mode
const demoDashboardData = {
  team: [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Product Manager",
      email: "alex@example.com",
      avatar: "/team/alex.png",
      status: "online",
      tasks: { completed: 12, pending: 3 },
      activeProjects: 2,
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "UX Designer",
      email: "sarah@example.com",
      avatar: "/team/sarah.png",
      status: "away",
      tasks: { completed: 18, pending: 1 },
      activeProjects: 3,
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Developer",
      email: "michael@example.com",
      avatar: "/team/michael.png",
      status: "offline",
      tasks: { completed: 15, pending: 5 },
      activeProjects: 2,
    },
  ],
  conversations: [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/team/alex.png",
      role: "Product Manager",
      lastMessage: "Can we discuss the new dashboard features?",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
    },
  ],
  events: [
    {
      id: 1,
      title: "Team Meeting",
      date: "2023-10-15",
      time: "10:00 AM - 11:00 AM",
      type: "meeting",
      description: "Weekly team sync-up",
    },
  ],
  settings: {
    theme: "system",
    language: "en",
    notifications: {
      email: { updates: true, marketing: false, system: true },
      app: { messages: true, mentions: true, activity: false },
      calendar: { reminders: true, invites: true },
    },
    layout: { compact: false, sidebarAlwaysOpen: true },
  },
};

export async function GET(request: Request) {
  try {
    // Check the URL for a demo mode parameter
    const url = new URL(request.url);
    const isDemoMode = url.searchParams.get("demo") === "true";

    // If we're in demo mode, return demo data
    if (isDemoMode) {
      console.log("Using demo user data");
      return NextResponse.json({
        user: demoUser,
        userData: demoDashboardData,
      });
    }

    // For real authentication, use NextAuth session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the user data and return it
    const userData = await getUserData();

    return NextResponse.json({
      user: {
        id: session.user.id || "user-id",
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || "viewer",
      },
      userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
