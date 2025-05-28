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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/simple-toast";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  getLayoutSettings,
  setLayoutSettings,
} from "@/lib/storage";

type AppearanceSettingsProps = {
  appearanceSettings: {
    theme: string;
    language: string;
    layout: {
      compact: boolean;
      sidebarAlwaysOpen: boolean;
    };
  };
};

export default function AppearanceSettings({
  appearanceSettings,
}: AppearanceSettingsProps) {
  // Get the theme context
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();

  // Initialize with props, but check local storage for overrides
  const [settings, setSettings] = useState(() => {
    // We're in a client component so we can safely access localStorage during initialization
    if (typeof window !== "undefined") {
      return {
        theme: getTheme() || appearanceSettings.theme,
        language: getLanguage() || appearanceSettings.language,
        layout: getLayoutSettings() || appearanceSettings.layout,
      };
    }
    return appearanceSettings;
  });

  // Apply theme immediately when component mounts
  useEffect(() => {
    if (contextTheme !== settings.theme) {
      setContextTheme(settings.theme as "light" | "dark" | "system");
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));

    // Use the theme provider context to apply the theme
    setContextTheme(theme as "light" | "dark" | "system");

    // Save to storage
    setTheme(theme);
  };

  const handleLanguageChange = (language: string) => {
    setSettings((prev) => ({
      ...prev,
      language,
    }));

    console.log(`Setting language to ${language}`);

    setLanguage(language);
  };

  const handleLayoutChange = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        [setting]: value,
      },
    }));

    console.log(`Setting layout.${setting} to ${value}`);

    setLayoutSettings({
      ...getLayoutSettings(),
      [setting]: value,
    });
  };

  const handleSavePreferences = () => {
    // Save theme to context and storage
    setContextTheme(settings.theme as "light" | "dark" | "system");
    setTheme(settings.theme);

    // Save other settings
    setLanguage(settings.language);
    setLayoutSettings(settings.layout);

    // In a real app, you would save this to your backend
    console.log("Saving preferences:", settings);

    toast({
      title: "Preferences saved",
      description: "Your appearance settings have been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how the dashboard looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Theme</h3>
          <RadioGroup
            value={settings.theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="h-6 w-6 mb-3" />
                <span>Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="h-6 w-6 mb-3" />
                <span>Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="peer sr-only"
              />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex h-6 w-6 items-center justify-center mb-3">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Language</h3>
          <div className="max-w-md">
            <Select
              value={settings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Dashboard Layout</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="layout-compact"
                className="flex flex-col space-y-1"
              >
                <span>Compact Mode</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Reduce spacing and padding in the dashboard
                </span>
              </Label>
              <Switch
                id="layout-compact"
                checked={settings.layout.compact}
                onCheckedChange={(checked) =>
                  handleLayoutChange("compact", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="layout-sidebar"
                className="flex flex-col space-y-1"
              >
                <span>Sidebar Always Open</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Keep the sidebar expanded at all times
                </span>
              </Label>
              <Switch
                id="layout-sidebar"
                checked={settings.layout.sidebarAlwaysOpen}
                onCheckedChange={(checked) =>
                  handleLayoutChange("sidebarAlwaysOpen", checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
