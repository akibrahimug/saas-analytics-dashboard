"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDemoAuth } from "@/lib/demo-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES, getRoleName } from "@/lib/roles"

export default function RegisterPageClient() {
  const router = useRouter()
  const { signIn } = useDemoAuth()

  const handleRegister = (role: string) => {
    signIn(role)
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Analytics Dashboard</CardTitle>
          <CardDescription>Select a role to register and continue to the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={() => handleRegister(ROLES.ADMIN)} className="w-full">
              Register as {getRoleName(ROLES.ADMIN)}
            </Button>
            <Button onClick={() => handleRegister(ROLES.MANAGER)} variant="outline" className="w-full">
              Register as {getRoleName(ROLES.MANAGER)}
            </Button>
            <Button onClick={() => handleRegister(ROLES.MEMBER)} variant="outline" className="w-full">
              Register as {getRoleName(ROLES.MEMBER)}
            </Button>
            <Button onClick={() => handleRegister(ROLES.VIEWER)} variant="outline" className="w-full">
              Register as {getRoleName(ROLES.VIEWER)}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
