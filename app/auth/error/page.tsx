"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorType = searchParams.get("error")
    let errorMessage = "An unknown error occurred during authentication."

    if (errorType === "Configuration") {
      errorMessage = "There is a problem with the server configuration."
    } else if (errorType === "AccessDenied") {
      errorMessage = "You do not have access to this resource."
    } else if (errorType === "Verification") {
      errorMessage = "The verification token has expired or has already been used."
    } else if (errorType === "Default") {
      errorMessage = "An error occurred during authentication."
    }

    setError(errorMessage)
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription>There was a problem with the authentication process.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
