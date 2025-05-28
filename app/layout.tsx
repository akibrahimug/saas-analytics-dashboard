import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { DemoModeProvider } from "@/lib/DemoModeContext";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Analytics dashboard for remote teams",
  generator: "Kasoma Ibrahim",
};

function getThemePreference() {
  return "system";
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getThemePreference();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={theme === "dark" ? "dark" : ""}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.className)}
      >
        <ThemeProvider defaultTheme={theme as "light" | "dark" | "system"}>
          <DemoModeProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </DemoModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
