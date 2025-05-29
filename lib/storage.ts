// Client-side storage utilities for persisting settings
// This complements the server-side data by providing instant local updates

// Storage keys
const STORAGE_KEYS = {
  THEME: "app-theme",
  LANGUAGE: "app-language",
  LAYOUT: "app-layout",
  NOTIFICATION_SETTINGS: "app-notification-settings",
  USER_PROFILE: "app-user-profile",
};

// Generic storage interface
const storage = {
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error);
    }
  },

  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  },
};

// Typed helpers for specific settings
export function getTheme(): string {
  return storage.getItem<string>(STORAGE_KEYS.THEME, "system");
}

export function setTheme(theme: string): void {
  storage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getLanguage(): string {
  return storage.getItem<string>(STORAGE_KEYS.LANGUAGE, "en");
}

export function setLanguage(language: string): void {
  storage.setItem(STORAGE_KEYS.LANGUAGE, language);
}

export function getLayoutSettings(): {
  compact: boolean;
  sidebarAlwaysOpen: boolean;
} {
  return storage.getItem<{ compact: boolean; sidebarAlwaysOpen: boolean }>(
    STORAGE_KEYS.LAYOUT,
    { compact: false, sidebarAlwaysOpen: true }
  );
}

export function setLayoutSettings(settings: {
  compact: boolean;
  sidebarAlwaysOpen: boolean;
}): void {
  storage.setItem(STORAGE_KEYS.LAYOUT, settings);
}

export function getNotificationSettings(): {
  email: { updates: boolean; marketing: boolean; system: boolean };
  app: { messages: boolean; mentions: boolean; activity: boolean };
  calendar: { reminders: boolean; invites: boolean };
} {
  return storage.getItem<{
    email: { updates: boolean; marketing: boolean; system: boolean };
    app: { messages: boolean; mentions: boolean; activity: boolean };
    calendar: { reminders: boolean; invites: boolean };
  }>(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
    email: { updates: true, marketing: false, system: true },
    app: { messages: true, mentions: true, activity: false },
    calendar: { reminders: true, invites: true },
  });
}

export function setNotificationSettings(settings: {
  email: { updates: boolean; marketing: boolean; system: boolean };
  app: { messages: boolean; mentions: boolean; activity: boolean };
  calendar: { reminders: boolean; invites: boolean };
}): void {
  storage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
}

// User profile data storage
export function getUserProfile(): {
  name?: string;
  email?: string;
  jobTitle?: string;
  timezone?: string;
  bio?: string;
} | null {
  return storage.getItem(STORAGE_KEYS.USER_PROFILE, null);
}

export function setUserProfile(profile: {
  name?: string;
  email?: string;
  jobTitle?: string;
  timezone?: string;
  bio?: string;
}): void {
  storage.setItem(STORAGE_KEYS.USER_PROFILE, profile);
}
