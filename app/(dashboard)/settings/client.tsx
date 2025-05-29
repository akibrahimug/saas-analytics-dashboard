"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDemoAuth } from "@/lib/demo-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from "@/components/settings/account-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import AppearanceSettings from "@/components/settings/appearance-settings";
import {
  getNotificationSettings,
  getTheme,
  getLanguage,
  getLayoutSettings,
} from "@/lib/storage";
import { useDemoMode } from "@/lib/DemoModeContext";

type User = {
  id: string;
  name?: string | null;
  email?: string;
  image?: string | null;
  role?: string;
};

// Component for NextAuth users
function RealAuthSettings({
  serverUser,
  serverSettings,
}: {
  serverUser: User | null;
  serverSettings: any;
}) {
  const { data: session } = useSession();
  const user = session?.user
    ? {
        id: session.user.id as string,
        name: session.user.name,
        email: session.user.email as string,
        image: session.user.image,
        role: session.user.role as string,
      }
    : serverUser;

  // Initialize settings with server data, but will be overridden by client storage
  const [settings, setSettings] = useState(serverSettings);

  // Load settings from client storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const clientSettings = {
        theme: getTheme() || serverSettings.theme,
        language: getLanguage() || serverSettings.language,
        notifications:
          getNotificationSettings() || serverSettings.notifications,
        layout: getLayoutSettings() || serverSettings.layout,
      };

      setSettings(clientSettings);
    }
  }, [serverSettings]);

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6 mt-6">
        <AccountSettings user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6 mt-6">
        <NotificationSettings notificationSettings={settings.notifications} />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6 mt-6">
        <AppearanceSettings
          appearanceSettings={{
            theme: settings.theme,
            language: settings.language,
            layout: settings.layout,
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

// Component for Demo users
function DemoAuthSettings({ serverSettings }: { serverSettings: any }) {
  const { session } = useDemoAuth();
  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }
    : null;

  // Initialize settings with server data, but will be overridden by client storage
  const [settings, setSettings] = useState(serverSettings);

  // Load settings from client storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const clientSettings = {
        theme: getTheme() || serverSettings.theme,
        language: getLanguage() || serverSettings.language,
        notifications:
          getNotificationSettings() || serverSettings.notifications,
        layout: getLayoutSettings() || serverSettings.layout,
      };

      setSettings(clientSettings);
    }
  }, [serverSettings]);

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6 mt-6">
        <AccountSettings user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6 mt-6">
        <NotificationSettings notificationSettings={settings.notifications} />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6 mt-6">
        <AppearanceSettings
          appearanceSettings={{
            theme: settings.theme,
            language: settings.language,
            layout: settings.layout,
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

// Main settings component that decides which implementation to use
export default function ClientSettings({
  user: serverUser,
  serverSettings,
}: {
  user: User | null;
  serverSettings: any;
}) {
  const { isDemo } = useDemoMode();

  // Render the appropriate settings component based on auth mode
  return isDemo ? (
    <DemoAuthSettings serverSettings={serverSettings} />
  ) : (
    <RealAuthSettings serverUser={serverUser} serverSettings={serverSettings} />
  );
}
