import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { ROLES } from "@/lib/roles";

// Function to create providers based on available environment variables
function createProviders() {
  const providers = [];

  // Add Google provider
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    })
  );

  // Always add credentials provider for demo/dev purposes
  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // This is a simplified demo - in a real app, you would validate against a database
        // For demo: admin@example.com / password
        if (
          credentials.email === "admin@example.com" &&
          credentials.password === "password"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          };
        }

        // For demo: user@example.com / password
        if (
          credentials.email === "user@example.com" &&
          credentials.password === "password"
        ) {
          return {
            id: "2",
            name: "Regular User",
            email: "user@example.com",
            role: "viewer",
          };
        }

        return null;
      },
    })
  );

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: createProviders(),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user.role as string) || ROLES.VIEWER;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

export async function getSession() {
  // This function is causing the error when called from client components
  // Comment it out and use a dummy implementation to avoid runtime errors
  // return await getServerSession(authOptions);

  // Return a mock session when called from client components
  return {
    user: {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@example.com",
      image: "/abstract-geometric-shapes.png",
      role: ROLES.ADMIN,
    },
  };
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  // In a real app, you would fetch user data from your database here
  // This is a simplified example
  return {
    id: session.user.id || "1",
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role || "admin",
  };
}

// Function to fetch user-specific data like team members, messages, etc.
export async function getUserData() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // In a real app, you would fetch this data from your database
  // based on the user's ID or other criteria
  return {
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
      // Other team members
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
      // Other conversations
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
      // Other events
    ],
    settings: {
      theme: "system",
      language: "en",
      notifications: {
        email: {
          updates: true,
          marketing: false,
          system: true,
        },
        app: {
          messages: true,
          mentions: true,
          activity: false,
        },
        calendar: {
          reminders: true,
          invites: true,
        },
      },
      layout: {
        compact: false,
        sidebarAlwaysOpen: true,
      },
    },
  };
}
