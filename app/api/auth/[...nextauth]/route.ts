import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Export a Next.js API route handler for NextAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
