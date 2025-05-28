"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { ROLES } from "@/lib/roles";

// Define the demo user
export const demoUser = {
  id: "demo-user-id",
  name: "Demo User",
  email: "demo@example.com",
  image: "/abstract-geometric-shapes.png",
  role: ROLES.ADMIN, // Default to admin for testing all features
};

// Define the session type with string role for simplicity
interface DemoSession {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
}

// Define the auth context type
interface DemoAuthContextType {
  session: DemoSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (role?: any) => void;
  signOut: () => void;
  setRole: (role: string) => void;
  isDemoMode: boolean;
}

// Create the context
const DemoAuthContext = createContext<DemoAuthContextType | undefined>(
  undefined
);

// Create the provider component
export function DemoAuthProvider({
  children,
  isDemoMode = false,
}: {
  children: React.ReactNode;
  isDemoMode?: boolean;
}) {
  const [session, setSession] = useState<DemoSession | null>({
    user: {
      ...demoUser,
    },
  });
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("authenticated");

  // Initialize the session on mount
  useEffect(() => {
    try {
      // Check if we have a stored role in localStorage
      const storedRole =
        typeof window !== "undefined"
          ? localStorage.getItem("demoUserRole") || ROLES.ADMIN
          : ROLES.ADMIN;

      setSession({
        user: {
          ...demoUser,
          role: storedRole,
        },
      });
      setStatus("authenticated");
    } catch (error) {
      // If localStorage is not available, just use the default
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  // Sign in function (just sets the session)
  const signIn = (role = ROLES.ADMIN) => {
    setSession({
      user: {
        ...demoUser,
        role,
      },
    });
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("demoUserRole", role);
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
    setStatus("authenticated");
  };

  // Sign out function (clears the session)
  const signOut = () => {
    setSession(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("demoUserRole");
      }
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    setStatus("unauthenticated");
  };

  // Function to change the user's role
  const setRole = (role: string) => {
    if (session) {
      setSession({
        user: {
          ...session.user,
          role,
        },
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("demoUserRole", role);
        }
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
  };

  return (
    <DemoAuthContext.Provider
      value={{ session, status, signIn, signOut, setRole, isDemoMode }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useDemoAuth(): DemoAuthContextType {
  const context = useContext(DemoAuthContext);

  // If outside a provider, return safe defaults instead of throwing
  if (context === undefined) {
    // Return a default context with no-op functions
    return {
      session: null,
      status: "unauthenticated" as const,
      signIn: (role?: any) =>
        console.warn("useDemoAuth used outside DemoAuthProvider"),
      signOut: () => console.warn("useDemoAuth used outside DemoAuthProvider"),
      setRole: (role: string) =>
        console.warn("useDemoAuth used outside DemoAuthProvider"),
      isDemoMode: false,
    };
  }

  return context;
}
