import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserData, getCurrentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import ClientSettings from "./client";

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="space-y-4">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  // Fetch user data from the server
  const user = await getCurrentUser();
  const userData = await getUserData();

  // Default settings in case userData is null
  const defaultSettings = {
    theme: "system",
    language: "en",
    notifications: {
      email: { updates: true, marketing: false, system: true },
      app: { messages: true, mentions: true, activity: false },
      calendar: { reminders: true, invites: true },
    },
    layout: { compact: false, sidebarAlwaysOpen: true },
  };

  const userSettings = userData?.settings || defaultSettings;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <ClientSettings user={user} serverSettings={userSettings} />
      </Suspense>
    </div>
  );
}
