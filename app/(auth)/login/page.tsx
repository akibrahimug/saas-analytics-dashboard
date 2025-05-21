import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "Login | Analytics Dashboard",
  description: "Login to your account",
}

export default function LoginPage() {
  return <ClientPage />
}
