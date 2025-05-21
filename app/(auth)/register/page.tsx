import type { Metadata } from "next"
import RegisterPageClient from "./RegisterPageClient"

export const metadata: Metadata = {
  title: "Register | Analytics Dashboard",
  description: "Create a new account",
}

export default function RegisterPage() {
  return <RegisterPageClient />
}
