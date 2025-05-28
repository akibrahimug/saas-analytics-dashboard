"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getTheme, setTheme as setStoredTheme } from "@/lib/storage";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    (defaultTheme as Theme) || "system"
  );

  // Apply the theme to the document
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;

    // First remove existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(theme);
      root.style.colorScheme = theme;
    }
  };

  useEffect(() => {
    // On mount, read the theme from localStorage and apply it
    const savedTheme = getTheme() as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // If no saved theme, apply the default
      applyTheme(defaultTheme);
    }

    // Also set up a listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [defaultTheme, theme]);

  const changeTheme = (theme: Theme) => {
    setThemeState(theme);
    setStoredTheme(theme);
    applyTheme(theme);
  };

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: changeTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
