"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoAuth } from "@/lib/demo-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES, getRoleName } from "@/lib/roles"

export default function ClientPage() {
  const router = useRouter()
  const { signIn, status } = useDemoAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const handleLogin = (role: string) => {
    signIn(role)
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Analytics Dashboard</CardTitle>
          <CardDescription>Select a role to continue to the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={() => handleLogin(ROLES.ADMIN)} className="w-full">
              Login as {getRoleName(ROLES.ADMIN)}
            </Button>
            <Button onClick={() => handleLogin(ROLES.MANAGER)} variant="outline" className="w-full">
              Login as {getRoleName(ROLES.MANAGER)}
            </Button>
            <Button onClick={() => handleLogin(ROLES.MEMBER)} variant="outline" className="w-full">
              Login as {getRoleName(ROLES.MEMBER)}
            </Button>
            <Button onClick={() => handleLogin(ROLES.VIEWER)} variant="outline" className="w-full">
              Login as {getRoleName(ROLES.VIEWER)}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              This is a demo login page. In a real application, you would have a proper authentication system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
