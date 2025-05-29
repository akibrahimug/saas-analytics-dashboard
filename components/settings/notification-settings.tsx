"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/simple-toast";
import { BellRing, CalendarClock, Mail } from "lucide-react";
import {
  getNotificationSettings,
  setNotificationSettings,
} from "@/lib/storage";

type NotificationSettingsProps = {
  notificationSettings: {
    email: {
      updates: boolean;
      marketing: boolean;
      system: boolean;
    };
    app: {
      messages: boolean;
      mentions: boolean;
      activity: boolean;
    };
    calendar: {
      reminders: boolean;
      invites: boolean;
    };
  };
};

export default function NotificationSettings({
  notificationSettings,
}: NotificationSettingsProps) {
  // Initialize with props, but check local storage for overrides
  const [settings, setSettings] = useState(() => {
    // We're in a client component so we can safely access localStorage during initialization
    if (typeof window !== "undefined") {
      return getNotificationSettings() || notificationSettings;
    }
    return notificationSettings;
  });

  const handleToggle = (category: string, setting: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [setting]: value,
      },
    };

    setSettings(newSettings);

    // Persist the change
    setNotificationSettings(newSettings);

    // In a real app, you would save this to your backend
    console.log(`Setting ${category}.${setting} to ${value}`);
  };

  const sendTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your inbox.",
    });
  };

  const sendTestNotification = () => {
    toast({
      title: "Test notification",
      description: "This is a test notification.",
    });
  };

  const sendTestCalendarNotification = () => {
    toast({
      title: "Test calendar notification",
      description: "This is a test calendar notification.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how and when you want to be notified
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Email Notifications</h3>
              <Button variant="outline" size="sm" onClick={sendTestEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Test Email
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="email-updates"
                  className="flex flex-col space-y-1"
                >
                  <span>Product Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive emails about product updates and new features
                  </span>
                </Label>
                <Switch
                  id="email-updates"
                  checked={settings.email.updates}
                  onCheckedChange={(checked) =>
                    handleToggle("email", "updates", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="email-marketing"
                  className="flex flex-col space-y-1"
                >
                  <span>Marketing Emails</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive promotional emails and special offers
                  </span>
                </Label>
                <Switch
                  id="email-marketing"
                  checked={settings.email.marketing}
                  onCheckedChange={(checked) =>
                    handleToggle("email", "marketing", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="email-system"
                  className="flex flex-col space-y-1"
                >
                  <span>System Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive important system notifications and alerts
                  </span>
                </Label>
                <Switch
                  id="email-system"
                  checked={settings.email.system}
                  onCheckedChange={(checked) =>
                    handleToggle("email", "system", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">In-App Notifications</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={sendTestNotification}
              >
                <BellRing className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="app-messages"
                  className="flex flex-col space-y-1"
                >
                  <span>Messages</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notify when you receive new messages
                  </span>
                </Label>
                <Switch
                  id="app-messages"
                  checked={settings.app.messages}
                  onCheckedChange={(checked) =>
                    handleToggle("app", "messages", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="app-mentions"
                  className="flex flex-col space-y-1"
                >
                  <span>Mentions</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notify when you're mentioned in comments
                  </span>
                </Label>
                <Switch
                  id="app-mentions"
                  checked={settings.app.mentions}
                  onCheckedChange={(checked) =>
                    handleToggle("app", "mentions", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="app-activity"
                  className="flex flex-col space-y-1"
                >
                  <span>Team Activity</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Notify for team member activities
                  </span>
                </Label>
                <Switch
                  id="app-activity"
                  checked={settings.app.activity}
                  onCheckedChange={(checked) =>
                    handleToggle("app", "activity", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Calendar Notifications</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={sendTestCalendarNotification}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Test Calendar
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="calendar-reminders"
                  className="flex flex-col space-y-1"
                >
                  <span>Event Reminders</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive reminders for upcoming events
                  </span>
                </Label>
                <Switch
                  id="calendar-reminders"
                  checked={settings.calendar.reminders}
                  onCheckedChange={(checked) =>
                    handleToggle("calendar", "reminders", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="calendar-invites"
                  className="flex flex-col space-y-1"
                >
                  <span>Calendar Invites</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications for new calendar invites
                  </span>
                </Label>
                <Switch
                  id="calendar-invites"
                  checked={settings.calendar.invites}
                  onCheckedChange={(checked) =>
                    handleToggle("calendar", "invites", checked)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setNotificationSettings(settings)}>
              Save Notification Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
