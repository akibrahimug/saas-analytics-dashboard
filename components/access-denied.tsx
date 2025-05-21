import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AccessDeniedProps {
  message?: string
  backUrl?: string
}

export function AccessDenied({
  message = "You don't have permission to access this page.",
  backUrl = "/dashboard",
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      <Button asChild>
        <Link href={backUrl}>Go Back</Link>
      </Button>
    </div>
  )
}
