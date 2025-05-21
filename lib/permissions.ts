import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { hasPermission, type Permission } from "@/lib/roles"

export async function checkPermission(permission: Permission, redirectTo = "/dashboard") {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const userRole = user.role as string

  if (!hasPermission(userRole, permission)) {
    redirect(redirectTo)
  }
}
