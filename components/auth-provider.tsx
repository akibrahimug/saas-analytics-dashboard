"use client";

import type * as React from "react";
import { SessionProvider } from "next-auth/react";
import { DemoAuthProvider } from "@/lib/demo-auth";
import { useDemoMode } from "@/lib/DemoModeContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isDemo } = useDemoMode();

  return (
    // ALWAYS include NextAuth's SessionProvider
    <SessionProvider>
      {isDemo ? (
        // if demo, wrap children in your stub
        <DemoAuthProvider isDemoMode>{children}</DemoAuthProvider>
      ) : (
        // otherwise pass straight through
        children
      )}
    </SessionProvider>
  );
}
